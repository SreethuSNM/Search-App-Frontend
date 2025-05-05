import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { User, DecodedToken } from "../types/types";

const base_url = "https://search-server.long-rain-28bb.workers.dev";


interface AuthState {
  user: User;
  sessionToken: string;
}

/**
 * Custom hook for managing authentication state and token exchange.
 *
 * Authentication Flow:
 * 1. User initiates auth -> exchangeAndVerifyIdToken()
 *    - Gets ID token from Webflow (Designer APIs)
 *    - Exchanges it for a session token via API
 *
 * 2. Token Exchange -> tokenMutation
 *    - Sends ID token to Data Client
 *    - Data Client validates and returns session token
 *    - On success, decodes and stores token + user data
 *
 * 3. Session Management -> useQuery for token validation
 *    - Automatically checks for existing valid session
 *    - Handles token expiration
 *    - Manages loading states
 *
 * @returns {Object} Authentication utilities and state
 * - user: Current user information
 * - sessionToken: Active session token
 * - isAuthLoading: Loading state
 * - exchangeAndVerifyIdToken: Exchange ID token for session token
 * - logout: Clear authentication state
 */
export function useAuth() {
  const queryClient = useQueryClient();
  const isExchangingToken = { current: false };
  

  // Query for managing auth state and token validation
  const { data: authState, isLoading: isAuthLoading } = useQuery<AuthState>({
    queryKey: ["auth"],
    queryFn: async () => {
      const storedUser = localStorage.getItem("wf_hybrid_user");
      const wasExplicitlyLoggedOut = localStorage.getItem(
        "explicitly_logged_out"
      );

      // Return initial state if no stored user or logged out
      if (!storedUser || wasExplicitlyLoggedOut) {
        return { user: { firstName: "", email: "" }, sessionToken: "" };
      }

      try {
        const userData = JSON.parse(storedUser);
        if (!userData.sessionToken) {
          return { user: { firstName: "", email: "" }, sessionToken: "" };
        }

        // Decode and validate token
        const decodedToken = jwtDecode(userData.sessionToken) as DecodedToken;
        if (decodedToken.exp * 1000 <= Date.now()) {
          // Token expired - clear storage
          localStorage.removeItem("wf_hybrid_user");
          return { user: { firstName: "", email: "" }, sessionToken: "" };
        }

        // Return valid auth state
        return {
          user: {
            firstName: decodedToken.user.firstName,
            email: decodedToken.user.email,
          },
          sessionToken: userData.sessionToken,
        };
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        // Clear invalid data
        localStorage.removeItem("wf_hybrid_user");
        return { user: { firstName: "", email: "" }, sessionToken: "" };
      }
    },
    staleTime: Infinity, // Never consider the data stale
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    gcTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  // Mutation for exchanging ID token for session token
  const tokenMutation = useMutation({
    mutationFn: async (idToken: string) => {
      // Get site info from Webflow
      const siteInfo = await webflow.getSiteInfo();

      // Exchange token with backend
      const response = await fetch(`${base_url}/api/auth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: idToken, siteId: siteInfo.siteId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to exchange token: ${JSON.stringify(errorData)}`
        );
      }

      const data = await response.json();
      if (!data.sessionToken) {
        throw new Error("No session token received");
      }

      return data;
    },
    onSuccess: (data) => {
      try {
        // Decode the new token
       const decodedToken = jwtDecode(data.sessionToken) as DecodedToken;
        const userData = {
          sessionToken: data.sessionToken,
          firstName: data.firstName,
          email: data.email,
          exp: decodedToken.exp,
        };

        // Update localStorage
        localStorage.setItem("wf_hybrid_user", JSON.stringify(userData));
        localStorage.removeItem("explicitly_logged_out");

        // Directly update the query data instead of invalidating
        queryClient.setQueryData<AuthState>(["auth"], {
          user: {
            firstName: decodedToken.user.firstName,
            email: decodedToken.user.email,
          },
          sessionToken: data.sessionToken,
        });
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    },
  });

  // Function to initiate token exchange process
// Inside your useAuth hook
const exchangeAndVerifyIdToken = async () => {
  try {
    // Get new ID token from Webflow
    const idToken = await webflow.getIdToken();
    const siteInfo = await webflow.getSiteInfo();
    
    const response = await fetch(`${base_url}/api/auth/token`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        idToken, 
        siteId: siteInfo.siteId 
      }),
    });

    const data = await response.json();
    console.log("token Exchange Response Data:",data)

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${data.error}`);
    }

    // Store in localStorage
    const userData = {
      sessionToken: data.sessionToken,
      firstName: data.firstName,
      email: data.email,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours from now
    };
    console.log("userdata",userData)
    localStorage.setItem("wf_hybrid_user", JSON.stringify(userData));
    localStorage.removeItem("explicitly_logged_out");

    // Update React Query cache
    console.log("🔄 Updating React Query cache");
    queryClient.setQueryData<AuthState>(["auth"], {
      user: {
        firstName: data.firstName,
        email: data.email
      },
      sessionToken: data.sessionToken
    });

    console.log("✅ Token exchange completed successfully");
   const saveLocalstorageData= localStorage.getItem("wf_hybrid_user");
   console.log("Saved local storage data",saveLocalstorageData);
  } catch (error) {
    console.error("❌ Token exchange error:", error);
    localStorage.removeItem("wf_hybrid_user");
    throw error;
  }
};
  
  // Add this to your openAuthScreen function
  const openAuthScreen = () => {
    console.log("🔓 Opening auth window...");
    const authWindow = window.open(
      `${base_url}/api/auth/authorize?state=webflow_designer`,
      "_blank",
      "width=600,height=600"
    );
  
    if (!authWindow) {
      console.error("❌ Popup blocked!");
      return;
    }
  
    const onAuth = async () => {
      console.log("👤 User authenticated!");
      await exchangeAndVerifyIdToken();
    };
  
    const checkWindow = setInterval(() => {
      if (authWindow?.closed) {
        console.log("🚪 Auth window closed");
        clearInterval(checkWindow);
        onAuth();
      }
    }, 1000);
  };
  // Function to handle user logout
  const logout = () => {
    // Set logout flag and clear storage
    localStorage.setItem("explicitly_logged_out", "true");
    localStorage.removeItem("wf_hybrid_user");
    queryClient.setQueryData(["auth"], {
      user: { firstName: "", email: "" },
      sessionToken: "",
    });
    queryClient.clear();
  };

  return {
    user: authState?.user || { firstName: "", email: "" },
    sessionToken: authState?.sessionToken || "",
    isAuthLoading,
    exchangeAndVerifyIdToken,
    logout,
  };
}