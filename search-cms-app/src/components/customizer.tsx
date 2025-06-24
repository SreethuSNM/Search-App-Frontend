import React, { useEffect, useRef } from "react";
import iro from "@jaames/iro";
import "../styles/customize.css";
import { useAuth } from "../hooks/useAuth";
import { applyScript,registerSearchScriptPage } from "../services/api";

type CodeApplication = {
  targetType: "site" | "page";
  targetId: string;
  scriptId: string;
  pageId :string;
  location: "header";
  version: string;
};

const fontFamilies = ["Arial", "Georgia", "Times New Roman", "Verdana", "Courier New"];
const fontWeights = [
  { label: "Light", value: "font-light" },
  { label: "Normal", value: "font-normal" },
  { label: "Medium", value: "font-medium" },
  { label: "Semibold", value: "font-semibold" },
  { label: "Bold", value: "font-bold" },
  { label: "Extrabold", value: "font-extrabold" },
];

const fontWeightFromClass = (className) => {
  switch (className) {
    case "font-light":
      return 300;
    case "font-normal":
      return 400;
    case "font-medium":
      return 500;
    case "font-semibold":
      return 600;
    case "font-bold":
      return 700;
    case "font-extrabold":
      return 800;
    default:
      return 400;
  }
};



export default function Customizer({ 
  setActiveComponent, 
  customStyle, 
  setCustomStyle,
  selectedCollections,
  selectedFields,
  selectedDisplayFields,
  option,
  pages,
  userOption,
  setupConfig,
 filterCollectionId,
  filterCollectionName,
  filterFields,

}) {
  // Destructure with defaults
  const {
    borderRadius = "8px",
    titleColor = "#cf06aa",
    titleFontSize = "16px",
     titleFontWeight = "font-bold",
    titleFontFamily = "Arial",
    otherFieldsColor = "#00a619",
    otherFieldsFontSize = "14px",
    otherFieldsFontWeight = "font-normal",
    boxShadow = true,
  } = customStyle;

  // Helper to update one field in customStyle
  const setValue = (key, value) => {
    setCustomStyle(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Refs for color pickers
  const titleColorRef = useRef(null);
  const otherColorRef = useRef(null);
  const titleColorPicker = useRef(null);
  const otherColorPicker = useRef(null);

  // Initialize iro color pickers once
  useEffect(() => {
    if (titleColorRef.current && !titleColorPicker.current) {
      titleColorPicker.current = iro.ColorPicker(titleColorRef.current, {
        width: 100,
        color: titleColor,
      });
      titleColorPicker.current.on("color:change", color => {
        setValue("titleColor", color.hexString);
      });
    }
    if (otherColorRef.current && !otherColorPicker.current) {
      otherColorPicker.current = iro.ColorPicker(otherColorRef.current, {
        width: 100,
        color: otherFieldsColor,
      });
      otherColorPicker.current.on("color:change", color => {
        setValue("otherFieldsColor", color.hexString);
      });
    }
  }, []); // run once

const {sessionToken } = useAuth();

const handleRegisterPageScript = async (pageId: string) => {
  try {
    if (!sessionToken) {
      webflow.notify({ type: "Error", message: "Session token missing." });
      return;
    }

    const scriptData = await registerSearchScriptPage(sessionToken);
    console.log("Hosting page script response:", scriptData);

    if (!scriptData?.result?.id || !scriptData?.result?.version) {
      throw new Error("Invalid script data");
    }

    const scriptId = scriptData.result.id;
    const version = scriptData.result.version;

    const siteIdInfo = await webflow.getSiteInfo();
    if (!siteIdInfo?.siteId) {
      webflow.notify({ type: "Error", message: "Site ID not found." });
      return;
    }

    const params: CodeApplication = {
      targetType: "page",
      targetId: pageId,
      scriptId,
      location: "header",
      version,
      pageId,
    };

    console.log("Applying script to page header:", params);
    await applyScript(params, sessionToken);

    webflow.notify({
      type: "Success",
      message: "Script registered to page header!",
    });
  } catch (error) {
    console.error("Error in handleRegisterScript:", error);
    webflow.notify({
      type: "Error",
      message: "Failed to complete the setup process.",
    });
  }
};


const handleSearchResultpage = async () => {
  try {
    const injectSearchConfig = async (parentElement: any) => {
      const newDiv = await parentElement.before(webflow.elementPresets.DivBlock);
      if (!newDiv) throw new Error("Failed to create config div.");

      await newDiv.setCustomAttribute("id", "search-config");
      await newDiv.setCustomAttribute("style", "display: none;");
      await newDiv.setCustomAttribute("data-selected-fields-search", JSON.stringify(selectedFields));
      await newDiv.setCustomAttribute("data-selected-collections", JSON.stringify(selectedCollections));
      await newDiv.setCustomAttribute("data-filter-fields", JSON.stringify(selectedFields));
      await newDiv.setCustomAttribute("data-selected-fields-display", JSON.stringify(selectedDisplayFields));
      await newDiv.setCustomAttribute("data-selected-option", option);
      await newDiv.setCustomAttribute("data-border-radius", customStyle.borderRadius);
      await newDiv.setCustomAttribute("data-title-color", customStyle.titleColor);
      await newDiv.setCustomAttribute("data-title-font-size", customStyle.titleFontSize);
      await newDiv.setCustomAttribute("data-title-font-weight", customStyle.titleFontWeight);
      await newDiv.setCustomAttribute("data-title-font-family", customStyle.titleFontFamily);
      await newDiv.setCustomAttribute("data-other-fields-color", customStyle.otherFieldsColor);
      await newDiv.setCustomAttribute("data-other-fields-font-size", customStyle.otherFieldsFontSize);
      await newDiv.setCustomAttribute("data-other-font-weight", customStyle.otherFieldsFontWeight);
      await newDiv.setCustomAttribute("data-box-shadow", customStyle.boxShadow ? "true" : "false");
      await newDiv.setCustomAttribute("data-search-bar", setupConfig.searchType);
      await newDiv.setCustomAttribute("data-pagination-type", setupConfig.paginationType);
      await newDiv.setCustomAttribute("data-display-mode", setupConfig.displayMode);

      if (setupConfig.displayMode === "List") {
        await newDiv.setCustomAttribute("data-items-per-page", setupConfig.itemsPerPage);
        await newDiv.removeCustomAttribute("data-grid-rows");
        await newDiv.removeCustomAttribute("data-grid-columns");
      } else {
        await newDiv.setCustomAttribute("data-grid-rows", setupConfig.rows);
        await newDiv.setCustomAttribute("data-grid-columns", setupConfig.columns);
        await newDiv.removeCustomAttribute("data-items-per-page");
      }
    };

    const createSearchUI = async (parentSection: any) => {
      const containerDiv = await parentSection.append(webflow.elementPresets.DivBlock);
      const containerStyle = (await webflow.getStyleByName("searchFormContainer")) || await webflow.createStyle("searchFormContainer");
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
      const formWrapperStyle = (await webflow.getStyleByName("searchResultFormWrapper")) || await webflow.createStyle("searchResultFormWrapper");
      await formWrapperStyle.setProperties({
        "display": "flex",
        "flex-direction": "column",
        "justify-content": "center",
        "width": "100%",
        "max-width": "600px",
        "margin-top": "20px",
      });
      await formWrapper.setStyles?.([formWrapperStyle]);
      await formWrapper.append(webflow.elementPresets.SearchForm);

      const iconWrapper = await formWrapper.append(webflow.elementPresets.DivBlock);
      const iconWrapperStyle = (await webflow.getStyleByName("searchIconContainer")) || await webflow.createStyle("searchIconContainer");
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
      const iconStyle = (await webflow.getStyleByName("searchIconBackground")) || await webflow.createStyle("searchIconBackground");
      await iconStyle.setProperties({
        "background-image": "url('https://cdn.jsdelivr.net/npm/@tabler/icons/icons/search.svg')",
        "background-repeat": "no-repeat",
        "background-position": "center",
        
      });
      await iconDiv.setStyles?.([iconStyle]);

      const resultsDiv = await containerDiv.append(webflow.elementPresets.DivBlock);
      const resultsStyle = (await webflow.getStyleByName("searchResults")) || await webflow.createStyle("searchResults");
      await resultsStyle.setProperties({
        "margin-top": "20px",
        "background-color": "#FFFFFF",
        
        "box-shadow": "0 0 0 1px #ddd",
        "width": "100%",
        "height": "auto",
        "flex-grow": "1",
      });
      await resultsDiv.setStyles?.([resultsStyle]);
    };

    const existingPage = pages.find(
      (page: { name: string; slug: string }) =>
        page.name === "SearchApp Results" || page.slug === "search-app-results"
    );

    if (existingPage) {
      console.log("Page already exists:", existingPage.name);
      await webflow.switchPage(existingPage.id);

      await new Promise<void>((resolve) => {
        setTimeout(async () => {
          const root = await webflow.getRootElement();
          const section = await (root as any).append(webflow.elementPresets.Section);
          await injectSearchConfig(section);
          await createSearchUI(section);
          await handleRegisterPageScript(existingPage.id); // ✅ Register script
          webflow.notify({ type: "Success", message: "Page configured and script registered!" });
          resolve();
        }, 1000);
      });

      return existingPage.id;
    } else {
      const newPage = await webflow.createPage();
      await newPage.setName("SearchApp Results");
      await newPage.setSlug("search-app-results");
      await webflow.switchPage(newPage);

      await new Promise<void>((resolve) => {
        setTimeout(async () => {
          const root = await webflow.getRootElement();
          const section = await (root as any).append(webflow.elementPresets.Section);
          await injectSearchConfig(section);
          await createSearchUI(section);
          await handleRegisterPageScript(newPage.id); // ✅ Register script
          webflow.notify({ type: "Success", message: "Page configured and script registered!" });
          resolve();
        }, 1000);
      });

      return newPage.id;
    }
  } catch (error) {
    console.error("Unexpected error during setup:", error);
    webflow.notify({ type: "Error", message: "Unexpected error occurred." });
  }
};



const handleClickContinue = async () => {
  const pageId = await handleSearchResultpage(); // 👈 Page creation + script handled inside
  if (!pageId) {
    console.error("Page ID missing after setup.");
  }
};



  return (
    <div className="choose-wrapper">
      <div className="choose-header">
        <button  onClick={() => {

           handleClickContinue();
            setActiveComponent("selectpage");
          }} className="continue-button">
          Continue
        </button>
      </div>

     
      <hr className="separator-line" />

      <div className="choose-container" style={{ display: "flex", gap: "2rem" }}>
        {/* Left: Controls */}
        <div style={{ flex: 1 }}>
          <h1 className="choose-title">Customize Display Style</h1>

          <div className="form-group">
            <label>Border Radius</label>
            <input
              type="text"
              value={borderRadius}
              onChange={e => setValue("borderRadius", e.target.value)}
              placeholder="e.g. 8px or 0.5rem"
            />
          </div>

          <div className="form-group">
            <label>Box Shadow</label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                className={`switch ${boxShadow ? "on" : ""}`}
                onClick={() => setValue("boxShadow", !boxShadow)}
              >
                <div className="slider" />
              </div>
              <div className="switch-label">{boxShadow ? "On" : "Off"}</div>
            </div>
          </div>

          <div className="form-group">
            <label>Title Font Size</label>
            <input
              type="text"
              value={titleFontSize}
              onChange={e => setValue("titleFontSize", e.target.value)}
              placeholder="e.g. 18px"
            />
          </div>

          <div className="form-group">
            <label>Title Font Weight</label>
            <select
              value={titleFontWeight}
              onChange={(e) => setValue("titleFontWeight", e.target.value)}
            >
              {fontWeights.map((fw) => (
                <option key={fw.value} value={fw.value}>
                  {fw.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Title Font Family</label>
            <select
              value={titleFontFamily}
              onChange={e => setValue("titleFontFamily", e.target.value)}
            >
              {fontFamilies.map(font => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Content Font Size</label>
            <input
              type="text"
              value={otherFieldsFontSize}
              onChange={e => setValue("otherFieldsFontSize", e.target.value)}
              placeholder="e.g. 14px"
            />
          </div>


          <div className="form-group">
            <label>Content Font Weight</label>
            <select
              value={otherFieldsFontWeight}
              onChange={(e) => setValue("otherFieldsFontWeight", e.target.value)}
            >
              {fontWeights.map((fw) => (
                <option key={fw.value} value={fw.value}>
                  {fw.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group color-row">
            <label>Title Color</label>
            <div className="color-picker-wrapper">
              <div ref={titleColorRef} className="color-picker" />
              <div className="color-selected" style={{ color: titleColor }}>
                Selected: {titleColor}
              </div>
            </div>
          </div>

          <div className="form-group color-row">
            <label>Content Color</label>
            <div className="color-picker-wrapper">
              <div ref={otherColorRef} className="color-picker" />
              <div className="color-selected" style={{ color: otherFieldsColor }}>
                Selected: {otherFieldsColor}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1 className="choose-title">Live Preview</h1>
          <div
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              borderRadius,
              background: "#f9f9f9",
              height: "250px",
              boxShadow: boxShadow ? "0 4px 8px rgba(0,0,0,0.1)" : "none",
            }}
          >
            <div
              style={{
                color: titleColor,
                fontSize: titleFontSize,
                fontFamily: titleFontFamily,
                fontWeight: "bold",
                margin: "0.5rem 0",
              }}
            >
              Title Example
            </div>
            <div style={{ color: otherFieldsColor, fontSize: otherFieldsFontSize, padding: "5px" }}>
              This is how your field text will appear. Adjust the settings to preview changes.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
