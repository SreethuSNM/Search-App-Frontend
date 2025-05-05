import React from "react";
import { useAuth } from "../hooks/useAuth";

const Authorize = ({ setActiveComponent }) => {  // Pass setActiveComponent as a prop

  const base_url = "https://search-server.long-rain-28bb.workers.dev";
  const { user, exchangeAndVerifyIdToken } = useAuth();

  const openAuthScreen = () => {
    console.log("Opening auth window...");
    const authWindow = window.open(
      `${base_url}/api/auth/authorize?state=webflow_designer`,  // URL for your auth endpoint
      "_blank",
      "width=600,height=600"
    );

    const onAuth = async () => {
      console.log("User authenticated!");
      await exchangeAndVerifyIdToken();  // Assuming exchangeAndVerifyIdToken is available

      // Instead of using window.location.href, call setActiveComponent
      setActiveComponent("choose");  // Update the step to 'choose'
    };

    const checkWindow = setInterval(() => {
      if (authWindow?.closed) {
        console.log("Auth window closed");
        clearInterval(checkWindow);
        onAuth();
      }
    }, 1000);
  };

  return (
    <div>
      <h1>Authorize Your Account</h1>
      <button className="authorize-button" onClick={openAuthScreen}>
        Authorize
      </button>
    </div>
  );
};

export default Authorize;
