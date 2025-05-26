import axios from 'axios';
const base_url = "https://search-server.long-rain-28bb.workers.dev";
import { CodeApplication } from "../types/types";

export const fetchSites = async (token: string) => {
  try {
    const response = await axios.get(`${base_url}/api/sites`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data; // return just the array of sites
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "An error occurred while fetching sites.");
  }
};

export const fetchCollections = async (token: string, siteId: string) => {
  try {
    const response = await axios.get(`${base_url}/api/collections`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        siteId: siteId,  // Pass siteId as a query parameter
      },
    });

    if (response.data && response.data.data) {
      return response.data.data;  // Collections data is expected under `data` key
    } else {
      throw new Error('No collections found');
    }
  } catch (error) {
    console.error("Error fetching collections:", error);
    throw new Error(error?.response?.data?.message || "An error occurred while fetching collections.");
  }
};

export const fetchCollectionItems = async (token: string, collectionId: string) => {
  try {
    const response = await axios.get(`${base_url}/api/collection-item`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        collectionId: collectionId,  // Pass collectionId as a query parameter
      },
    });

    if (response.data && response.data.data) {
      return response.data.data;  // Items array under `data` key
    } else {
      throw new Error('No items found in this collection');
    }
  } catch (error: any) {
    console.error("Error fetching collection items:", error);
    throw new Error(error?.response?.data?.message || "An error occurred while fetching collection items.");
  }
};


export const fetchPages = async (token: string, siteId: string) => {
  try {
    const response = await axios.get(`${base_url}/api/page-search`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        siteId: siteId,  // Pass siteId as a query parameter
      },
    });

    if (response.data && response.data.data) {
      return response.data.data;  
    } else {
      throw new Error('No Pages found');
    }
  } catch (error) {
    console.error("Error fetching Pages:", error);
    throw new Error(error?.response?.data?.message || "An error occurred while fetching Pages.");
  }
};




export const fetchPageDom = async (token: string, pageId: string) => {
  try {
    const response = await axios.get(`${base_url}/api/page-dom`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        pageId: pageId, // Send pageId as query param
      },
    });

    if (response.data && response.data.data) {
      return response.data.data;
    } else {
      throw new Error("No page content found");
    }
  } catch (error: any) {
    console.error("Error fetching page DOM:", error);
    throw new Error(error?.response?.data?.message || "An error occurred while fetching page content.");
  }
};


// Function to perform a search request to the backend
export const fetchSearchIndex = async (token: string, query: string, siteId: string) => {
  try {
    // Send a GET request to the search API endpoint with query and siteId as search parameters
    const response = await axios.get(`${base_url}/api/search-index`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the authorization token in the headers
      },
      params: {
        query: query, // Search query to filter the results
        siteId: siteId, // The site ID for which the search is being performed
      },
    });

    // Return the search results (response.data.results should be the array of search results)
    return response.data.results;
  } catch (error: any) {
    // If there is an error, throw a new error with the error message or a default message
    throw new Error(error?.response?.data?.message || "An error occurred while searching.");
  }


  
};


export const registerAnalyticsBlockingScript = async (token: string) => {
  try {
    const response = await fetch(`${base_url}/api/custom-code/apply-custom-code`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const text = await response.text();
    let data: any;

    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse response as JSON:", text);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.ok) {
      console.error("Error response:", data);

      // Handle the nested stringified JSON inside `details` (if any)
      let parsedDetails: any = {};
      try {
        if (typeof data.details === "string" && data.details.includes("duplicate_registered_script")) {
          const match = data.details.match(/"code":\s*"([^"]+)"/);
          if (match && match[1] === "duplicate_registered_script") {
            return {
              scriptId: "searchscript",
              version: "1.0.0",
              duplicate: true,
            };
          }
        }
      } catch (parseErr) {
        console.warn("Could not parse 'details' field:", parseErr);
      }

      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error in registerAnalyticsBlockingScript:", error);
    throw error;
  }
};

//  export const registerAnalyticsBlockingScript = async (token: string) => {
//   try {
   
//     const response = await fetch(`${base_url}/api/custom-code/apply-custom-code`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       },
     
//     });
//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('Error response:', errorText);
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log('Response data:', data);
//     return data;
//   } catch (error) {
//     console.error('Error in registerAnalyticsBlockingScript:', error);
//     throw error;
//   }
// }


// Apply script to site or page
export const  applyScript = async (params: CodeApplication, token: string) => {

  const response = await fetch(`${base_url}/api/custom-code/apply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  });
  console.log(params);
  return response.json();
}




