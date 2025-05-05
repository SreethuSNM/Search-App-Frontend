import React from "react";
import "../styles/finish.css"; // Import CSS file
import { useAuth } from "../hooks/useAuth";
import { registerAnalyticsBlockingScript } from "../services/api";

export default function Finish() {

  const {sessionToken } = useAuth();

  const handleClick = async () => {
    await Createinput();             // Add search input UI to the selected element
    await handleRegisterScript();    // Call your API to register custom script
  };


  const handleRegisterScript = async () => {
    try {
      if (!sessionToken) {
        console.warn("No session token available");
        webflow.notify({ type: "Error", message: "Session token missing." });
        return;
      }
  
      // Register the analytics blocking script
      await registerAnalyticsBlockingScript(sessionToken);
  
      // Create the input/search form in Webflow
      await Createinput();
  
      // Notify success
      webflow.notify({
        type: "Success",
        message: "Search form created and script registered!",
      });
    } catch (error) {
      console.error("Error in handleRegisterScript:", error);
      webflow.notify({
        type: "Error",
        message: "Failed to complete the setup process.",
      });
    }
  };
  
  
  const Createinput = async () => {
    try {
      const selectedElement = await webflow.getSelectedElement();
      if (!selectedElement) {
        webflow.notify({ type: "Error", message: "No element selected in the Designer." });
        return;
      }

      const containerDiv = await selectedElement.before(webflow.elementPresets.DivBlock);
      const containerStyle =
        (await webflow.getStyleByName("searchFormContainer")) ||
        (await webflow.createStyle("searchFormContainer"));
      await containerStyle.setProperties({
        "padding-top": "20px",
        "padding-bottom": "20px",
        "background-color": "#F9F9F9",
        "display": "flex",
        "flex-direction": "column",
        "align-items": "center",
      });
      await containerDiv.setStyles?.([containerStyle]);

      const formWrapper = await containerDiv.append(webflow.elementPresets.DivBlock);
      const formWrapperStyle =
        (await webflow.getStyleByName("searchFormWrapper")) ||
        (await webflow.createStyle("searchFormWrapper"));
      await formWrapperStyle.setProperties({
        "display": "flex",
        "flex-direction": "column",
        "justify-content": "center",
        "width": "100%",
        "max-width": "600px",
        "margin-top": "20px",
      });
      await formWrapper.setStyles?.([formWrapperStyle]);

      const searchForm = await formWrapper.append(webflow.elementPresets.SearchForm);
      const resultsDiv = await containerDiv.append(webflow.elementPresets.DivBlock);
      const resultsStyle =
        (await webflow.getStyleByName("searchResults")) ||
        (await webflow.createStyle("searchResults"));
      await resultsStyle.setProperties({
        "margin-top": "20px",
        "background-color": "#FFFFFF",
        "padding-top": "16px",
        "padding-bottom": "16px",
        "padding-left": "16px",
        "padding-right": "16px",
        "box-shadow": "0 0 0 1px #ddd", // border-like effect
        "width": "100%", // Ensure full width
        "height": "auto", // Allow height to adjust based on content
        "flex-grow": "1", // Allow the container to grow if inside a flexbox
      });
      await resultsDiv.setStyles?.([resultsStyle]);

      webflow.notify({ type: "Success", message: "Search form and results container added!" });
    } catch (error) {
      console.error("Error in Createinput:", error);
      webflow.notify({ type: "Error", message: "Failed to create search form and results." });
    }
  };

  // const Createinput = async () => {
  //   try {
  //     const selectedElement = await webflow.getSelectedElement();
  //     if (!selectedElement) {
  //       webflow.notify({ type: "Error", message: "No element selected in the Designer." });
  //       return;
  //     }
  
  //     // Step 1: Create a container div inside the selected element
  //     const containerDiv = await selectedElement.before(webflow.elementPresets.DivBlock);
  //     if (!containerDiv) throw new Error("Failed to create container div");
  
  //     const containerStyle =
  //       (await webflow.getStyleByName("searchFormContainer")) ||
  //       (await webflow.createStyle("searchFormContainer"));
  
  //     await containerStyle.setProperties({
  //       "padding-top": "20px",
  //       "padding-bottom": "20px",
  //       "background-color": "#f9f9f9",
  //       "display": "flex",
  //       "flex-direction": "column",
  //       "align-items": "center",
  //     });
  
  //     await containerDiv.setStyles?.([containerStyle]);
  
  //     // Step 2: Create a wrapper div for the SearchForm
  //     const formWrapper = await containerDiv.append(webflow.elementPresets.DivBlock);
  //     if (!formWrapper) throw new Error("Failed to insert form wrapper");
  
  //     const formWrapperStyle =
  //       (await webflow.getStyleByName("searchFormWrapper")) ||
  //       (await webflow.createStyle("searchFormWrapper"));
  
  //     await formWrapperStyle.setProperties({
  //       "display": "flex",
  //       "flex-direction": "column",
  //       "justify-content": "center",
        
  //       "width": "100%",
  //       "max-width": "600px",
  //       "margin-top": "20px",
  //     });
  
  //     await formWrapper.setStyles?.([formWrapperStyle]);
  
  //     // Step 3: Add the SearchForm inside the wrapper
  //     const searchForm = await formWrapper.append(webflow.elementPresets.SearchForm);
  //     if (!searchForm) throw new Error("Failed to insert SearchForm preset");
  
  //     // Step 4: Add a styled results container below the form
  //     const resultsDiv = await containerDiv.append(webflow.elementPresets.DivBlock);
  //     if (!resultsDiv) throw new Error("Failed to insert results div");
  
  //     const resultsStyle =
  //       (await webflow.getStyleByName("searchResults")) ||
  //       (await webflow.createStyle("searchResults"));
  
  //       await resultsStyle.setProperties({
  //         "margin-top": "20px",
  //         "background-color": "#ffffff",
  //         "padding-top": "16px",
  //         "padding-bottom": "16px",
  //         "padding-left": "16px",
  //         "padding-right": "16px",
  //         "box-shadow": "0 0 0 1px #ddd", // border-like effect
  //         "width": "100%", // Ensure full width
  //         "height": "auto", // Allow height to adjust based on content
  //         "flex-grow": "1", // Allow the container to grow if inside a flexbox
  //       });
        
  //     await resultsDiv.setStyles?.([resultsStyle]);
  
  //     webflow.notify({ type: "Success", message: "Search form and results container added!" });
  
  //   } catch (error) {
  //     console.error("Error in Createinput:", error);
  //     webflow.notify({ type: "Error", message: "Failed to create search form and results." });
  //   }
  // };



  
  return (
   
      <div className="finish-card">
        {/* Icon Section */}
        <div className="icons-container ">
          <img src="/images/union.png" alt="Verified" className="icon-union" />
          <img src="/images/setting-2.png" alt="Setting" className="icon-large" />
          <img src="/images/setting-2.png" alt="Setting" className="icon-small" />
        </div>

        {/* Text Section */}
        <h2 className="finish-title">Setup Completed!</h2>
        <p className="finish-text">
          Your search is now ready to go.
          You can check   <br /> your staging website.
        </p>

      
       
      <button className="finish-button" onClick={handleClick}>Back to webflow</button>
      
    
    </div>
  );
}
