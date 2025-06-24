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



export default function PageSelect({
  setActiveComponent,
  selectedCollections,
  selectedFields,
  selectedDisplayFields,
  option,
  customStyle,
  setupConfig,
  pages,
  userOption, 
selectedCollectionName,
  selectedPage, 
  setSelectedPage,
  filterCollectionId,
  filterCollectionName,
  filterFields,
}) {
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
const element = selectedElement as any;


    const formWrapper = await element.append(webflow.elementPresets.DivBlock);
    const formWrapperStyle =
      (await webflow.getStyleByName("searchFormWrapper")) ||
      (await webflow.createStyle("searchFormWrapper"));
    await formWrapperStyle.setProperties({
      "display": "flex",
      "flex-direction": "column",
      "justify-content": "center",
      "width": "100%",
      "max-width": "200px",
      "margin-top": "20px",
    });
    await formWrapper.setStyles?.([formWrapperStyle]);

const searchForm = await formWrapper.append(webflow.elementPresets.FormTextInput)




    // 🔍 Add search icon after the search form

const iconWrapper = await element.append(webflow.elementPresets.DivBlock);

const iconWrapperStyle =
  (await webflow.getStyleByName("searchIconContainer")) ||
  (await webflow.createStyle("searchIconContainer"));

await iconWrapperStyle.setProperties({
  "display": "flex",
  "justify-content": "center",
  "align-items": "center",
  "margin-top": "12px",
  "width": "30px",
  "height": "30px",
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
  "border-block-start-color": "orange",

  "border-block-end-style": "solid",
  "border-block-end-width": "1px",
  "border-block-end-color": "orange",

  "border-inline-start-style": "solid",
  "border-inline-start-width": "1px",
  "border-inline-start-color": "orange",

  "border-inline-end-style": "solid",
  "border-inline-end-width": "1px",
  "border-inline-end-color": "orange",
  // Add padding inside the border
  "padding-top": "20px",
  "padding-bottom": "20px",
  "padding-left": "20px",
  "padding-right": "20px",
});

await iconDiv.setStyles?.([iconStyle]);


    webflow.notify({ type: "Success", message: "Search form, icon, and results container added!" });
  } catch (error) {
    console.error("Error in Createinput:", error);
    webflow.notify({ type: "Error", message: "Failed to create search form and results." });
  }
}


const handleInject = async () => {
    try {
      const selectedElement = await webflow.getSelectedElement();
      if (!selectedElement) {
        webflow.notify({ type: "Error", message: "No element selected." });
        return;
      }

          const element = selectedElement as any;
          
      const injectConfig = async (el) => {
        const newDiv = await el.append(webflow.elementPresets.DivBlock);

        const existing = await el.querySelector?.("#searchConfig");

if (existing) {
  await existing.remove();
}
        await newDiv.setCustomAttribute("id", "search-config");
       
      await newDiv.setCustomAttribute("style", "display: none;");
    
      
      
      
  await newDiv.setCustomAttribute("data-selected-collections",JSON.stringify(selectedCollections));
  await newDiv.setCustomAttribute("data-selected-fields-search",JSON.stringify(selectedFields));


   
  await newDiv.setCustomAttribute("data-target-collection",JSON.stringify(selectedCollectionName));
  await newDiv.setCustomAttribute("data-filter-fields",JSON.stringify(filterFields));
      await newDiv.setCustomAttribute("data-selected-useroption", userOption);
      

    
      await newDiv.setCustomAttribute("data-selected-option", option);    
      await newDiv.setCustomAttribute("data-border-radius", customStyle.borderRadius);
      await newDiv.setCustomAttribute("data-title-color", customStyle.titleColor);
      await newDiv.setCustomAttribute("data-title-font-size", customStyle.titleFontSize);
      await newDiv.setCustomAttribute("data-title-font-weight", customStyle.titleFontWeight);
      await newDiv.setCustomAttribute("data-title-font-family", customStyle.titleFontFamily);
      await newDiv.setCustomAttribute("data-other-fields-color", customStyle.otherFieldsColor);
      await newDiv.setCustomAttribute("data-other-fields-font-size", customStyle.otherFieldsFontSize);
      await newDiv.setCustomAttribute("data-other-font-weight", customStyle.otherFieldsFontWeight);
      await newDiv.setCustomAttribute("data-selected-fields-display", JSON.stringify(selectedDisplayFields));
      await newDiv.setCustomAttribute("data-selected-fields-search", JSON.stringify(selectedFields));
      await newDiv.setCustomAttribute("data-box-shadow", customStyle.boxShadow ? "true" : "false");
      
    

    await newDiv.setCustomAttribute("data-search-bar", setupConfig.searchType);
      // await newDiv.setCustomAttribute("data-result-type", setupConfig.resultType);
      // await newDiv.setCustomAttribute("data-result-page", setupConfig.resultPage);
      await newDiv.setCustomAttribute("data-pagination-type", setupConfig.paginationType);
      await newDiv.setCustomAttribute("data-display-mode", setupConfig.displayMode);


        if (setupConfig.displayMode === "List") {
          await newDiv.setCustomAttribute("data-items-per-page", setupConfig.itemsPerPage);
        } else {
          await newDiv.setCustomAttribute("data-grid-rows", setupConfig.rows);
          await newDiv.setCustomAttribute("data-grid-columns", setupConfig.columns);
        }
      };

      await injectConfig(selectedElement);
      webflow.notify({ type: "Success", message: "Search config injected!" });
    } catch (err) {
      console.error(err);
      webflow.notify({ type: "Error", message: "Injection failed." });
    }
  };

const handleClick = async () => {
  await Createinput();
  await handleInject();
  await handleRegisterScript(); 
};

const handlePageChange = async (event) => {
    const pageId = event.target.value;
    const selected = pages.find((p) => p.id === pageId);
    if (selected) {
      setSelectedPage(selected);
      try {
        await webflow.switchPage(selected); // Assuming webflow is globally available
      } catch (error) {
        console.error("Failed to switch page:", error);
      }
    }
  };


  
  return (
   
       <div className="setup-wrapper">
      <div className="choose-header">
        <button onClick={() => setActiveComponent("finish")} className="continue-button">
          Continue
        </button>
      </div>
      <hr className="separator-line" />

        
        <div className="selection-header">

        <h2 className="selection-header">Choose the Page to Place Your Search Form</h2>
        </div>
      <select onChange={handlePageChange} value={selectedPage?.id || ""}>
        <option value="" disabled>Select a page</option>
        {pages.map((page) => (
          <option key={page.id} value={page.id}>
            {page.name}
          </option>

        ))}
      </select>
   

      

       <h2 className="choose-title"> ❗select where you want search form the click Add to page button</h2>
      <button className="finish-button" onClick={handleClick}>Add to page</button>

      
      
    </div>
      
  );
}
