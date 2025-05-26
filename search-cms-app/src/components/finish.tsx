import React from "react";
import "../styles/finish.css"; // Import CSS file
import { useAuth } from "../hooks/useAuth";
import { WebflowAPI } from '../types/webflowtypes';
import { applyScript, registerAnalyticsBlockingScript } from "../services/api";


type CodeApplication = {
  targetType: "site" | "page";
  targetId: string;
  scriptId: string;
  location: "header";
  version: string;
};



export default function Finish() {
const {sessionToken } = useAuth();

const handleRegisterScript = async () => {
    try {
      if (!sessionToken) {
        webflow.notify({ type: "Error", message: "Session token missing." });
        return;
      }

      const scriptData = await registerAnalyticsBlockingScript(sessionToken);
      console.log("Hosting script response:", scriptData);

      if (scriptData?.result?.id && scriptData?.result?.version) {
        const scriptId = scriptData.result.id;
        const version = scriptData.result.version;

        const siteIdInfo = await webflow.getSiteInfo();
        if (!siteIdInfo?.siteId) {
          webflow.notify({ type: "Error", message: "Site ID not found." });
          return;
        }

        const params: CodeApplication = {
          targetType: "site",
          targetId: siteIdInfo.siteId,
          scriptId,
          location: "header",
          version,
        };

        console.log("Applying script with params:", params);
        await applyScript(params, sessionToken);

        
        
          webflow.notify({
          type: "Success",
          message: "Script registered to site head!",
        });
      } else {
        throw new Error("Invalid script data");
      }
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

const searchForm = await formWrapper.append(webflow.elementPresets.SearchForm)

   
    // 🔍 Add search icon after the search form
const iconWrapper = await formWrapper.append(webflow.elementPresets.DivBlock);

const iconWrapperStyle =
  (await webflow.getStyleByName("searchIconContainer")) ||
  (await webflow.createStyle("searchIconContainer"));

await iconWrapperStyle.setProperties({
  "display": "flex",
  "justify-content": "center",
  "align-items": "center",
  "margin-top": "12px",
  "width": "40px",
  "height": "40px",
});

await iconWrapper.setStyles?.([iconWrapperStyle]);

const iconDiv = await iconWrapper.append(webflow.elementPresets.DivBlock);

const iconStyle =
  (await webflow.getStyleByName("searchIconBackground")) ||
  (await webflow.createStyle("searchIconBackground"));

await iconStyle.setProperties({
  "background-image": "url('https://cdn.jsdelivr.net/npm/@tabler/icons/icons/search.svg')",
  "background-repeat": "no-repeat",
  "background-position": "center",
   "border-block-start-style": "solid",
  "border-block-start-width": "1px",
  "border-block-start-color": "black",

  "border-block-end-style": "solid",
  "border-block-end-width": "1px",
  "border-block-end-color": "black",

  "border-inline-start-style": "solid",
  "border-inline-start-width": "1px",
  "border-inline-start-color": "black",

  "border-inline-end-style": "solid",
  "border-inline-end-width": "1px",
  "border-inline-end-color": "black",
  // Add padding inside the border
  "padding-top": "20px",
  "padding-bottom": "20px",
  "padding-left": "20px",
  "padding-right": "20px",
});

await iconDiv.setStyles?.([iconStyle]);

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
      "box-shadow": "0 0 0 1px #ddd",
      "width": "100%",
      "height": "auto",
      "flex-grow": "1",
    });
    await resultsDiv.setStyles?.([resultsStyle]);

    webflow.notify({ type: "Success", message: "Search form, icon, and results container added!" });
  } catch (error) {
    console.error("Error in Createinput:", error);
    webflow.notify({ type: "Error", message: "Failed to create search form and results." });
  }
};



const handleClick = async () => {
  await Createinput();
  await handleRegisterScript(); 
};

  
  return (
   
      <div className="finish-card">
        {/* Icon Section */}
        <div className="icons-container ">
          <img src="/images/union.png" alt="Verified" className="icon-union" />
          <img src="/images/setting-2.png" alt="Setting" className="icon-large" />
          <img src="/images/setting-2.png" alt="Setting" className="icon-small" />
        </div>

        {/* Text Section */}
        <h2 className="finish-title">Setup Completed.</h2>
        <p className="finish-text">
          Your search is now ready to go.
          You can check   <br /> your staging website.
        </p>

      
       
      <button className="finish-button" onClick={handleClick}>Back to webflow</button>
      
    
    </div>
  );
}
