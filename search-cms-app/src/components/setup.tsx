      "use client";
      import React, { useState } from "react";
      import "../styles/setup.css"; // Updated CSS file
      import Preview from "./preview";
      import Preview2 from "./preview2";

      export default function Setup({
  setActiveComponent,
  selectedCollections,
  selectedFields,
  selectedDisplayFields,
  option,
  customStyle,
}) {
        const [isMaximized, setIsMaximized] = useState(false);
        const [searchType, setSearchType] = useState("Expand");
        const [resultType, setResultType] = useState("Click on search");
        const [resultPage, setResultPage] = useState("Same page result");
        const [displayMode, setDisplayMode] = useState("List");
        const [itemsPerPage, setItemsPerPage] = useState("05");
        const [rows, setRows] = useState("03");
        const [columns, setColumns] = useState("03");
        const [paginationType, setPaginationType] = useState("Numbered");
  

        const handleContinue = async () => {
   try {
      const selectedElement = await webflow.getSelectedElement();
      if (!selectedElement) {
        webflow.notify({ type: "Error", message: "No element selected in the Designer." });
        return;
      }


    const newDiv = await selectedElement.before(webflow.elementPresets.DivBlock);
    if (!newDiv) {
      console.error("❌ Failed to create div.");
      webflow.notify({ type: "Error", message: "Failed to create div." });
     
      return;
    }

   // Set custom attributes for the new div
    await newDiv.setCustomAttribute("id", "search-config");
    await newDiv.setCustomAttribute("style", "display: none;");
    await newDiv.setCustomAttribute("data-selected-collections", JSON.stringify(selectedCollections));
    await newDiv.setCustomAttribute("data-selected-fields-search", JSON.stringify(selectedFields));
    await newDiv.setCustomAttribute("data-selected-fields-display", JSON.stringify(selectedDisplayFields));
    await newDiv.setCustomAttribute("data-selected-option", option);

    
await newDiv.setCustomAttribute("data-border-radius", customStyle.borderRadius);
await newDiv.setCustomAttribute("data-title-color", customStyle.titleColor);
await newDiv.setCustomAttribute("data-title-font-size", customStyle.titleFontSize);
await newDiv.setCustomAttribute("data-title-font-family", customStyle.titleFontFamily);
await newDiv.setCustomAttribute("data-other-fields-color", customStyle.otherFieldsColor);
await newDiv.setCustomAttribute("data-other-fields-font-size", customStyle.otherFieldsFontSize);
await newDiv.setCustomAttribute("data-box-shadow", customStyle.boxShadow ? "true" : "false");



    await newDiv.setCustomAttribute("data-search-bar", searchType);        
    await newDiv.setCustomAttribute("data-result-type", resultType);
    await newDiv.setCustomAttribute("data-result-page", resultPage);
    await newDiv.setCustomAttribute("data-pagination-type", paginationType);
    await newDiv.setCustomAttribute("data-display-mode", displayMode);
  
if (displayMode === "List") {
  await newDiv.setCustomAttribute("data-items-per-page", itemsPerPage);
  await newDiv.removeCustomAttribute("data-grid-rows");
  await newDiv.removeCustomAttribute("data-grid-columns");
} else if (displayMode === "Grid") {
  await newDiv.setCustomAttribute("data-grid-rows", rows);
  await newDiv.setCustomAttribute("data-grid-columns", columns);
  await newDiv.removeCustomAttribute("data-items-per-page");
}
    



    console.log("✅ Hidden config div injected.");

    webflow.notify({
      type: "Success",
      message: "Search config sent",
    });
    setActiveComponent("finish");

  } catch (error) {
    console.error("Unexpected error during div creation:", error);
    webflow.notify({ type: "Error", message: "Unexpected error occurred." });
  }
};

      

        return (
          
          <div className="setup-wrapper">
          <div className="choose-header">
           
<button onClick={() => { handleContinue(); setActiveComponent("finish");}}className="continue-button">Continue</button>

          </div>
          <hr className="separator-line" />

          <div className="component-container">
              {isMaximized ? (
                <Preview onMinimize={() => setIsMaximized(false)} searchType={searchType} resultType={resultType}/>
              ) : (
                <div className="inner-container">
              
              {/* Left: Settings */}
              <div className="settings-container">
                <h3 className="text-highlight">Search Bar</h3>
                <div className="radio-groups">
                  {["Expand", "Icon"].map((type) => (
                    <label key={type} className="radio-label">
                      <input
                        type="radio"
                        name="searchType"
                        value={type}
                        checked={searchType === type}
                        onChange={() => setSearchType(type)}
                      />
                      <span className="radio-circle"></span>
                      {type}
                    </label>
                  ))}
                </div>

                <h3 className="text-highlight">Result Type</h3>
                <div className="radio-groups">
                 {["Click on search", "Auto result"].map((type) => (
  <label key={type} className="radio-label">
    <input
      type="radio"
      name="resultType"
      value={type}
      checked={resultType === type}
      onChange={() => setResultType(type)}
    />
    <span className="radio-circle"></span>
    {type}
  </label>
))}

</div>

                <h3 className="text-highlight">Result Page</h3>
                <div className="radio-groups">
                  {["Same page result", "New Page"].map((type) => (
                    <label key={type} className="radio-label">
                      <input
                        type="radio"
                        name="resultPage"
                        value={type}
                        checked={resultPage === type}
                        onChange={() => setResultPage(type)}
                      />
                      <span className="radio-circle"></span>
                      {type}
                    </label>
                  ))}
                </div>

                <h3 className="text-highlight">Result Display</h3>
                <div className="display-toggle ">
                  <button
                    className={`toggle-btn ${displayMode === "List" ? "active" : ""}`}
                    onClick={() => setDisplayMode("List")}
                  >
                    <img src="/images/list.png" alt="List View" className="icon" />
                    <span className="text">List</span>
                  </button>

                  <button
                    className={`toggle-btn ${displayMode === "Grid" ? "active" : ""}`}
                    onClick={() => setDisplayMode("Grid")}
                  >
                    <img src="/images/grid.png" alt="Grid View" className="icon" />
                    <span className="text">Grid</span>
                  </button>
                </div>

              { displayMode === "List" && (
            <div className="list-container">
              <h2 className="list-title">Number of Items List</h2>
              <select
        value={itemsPerPage}
        onChange={(e) => setItemsPerPage(e.target.value)} // No need for Number()
        className="dropdown"
      >
        {Array.from({ length: 10 }, (_, i) => (i + 1).toString()).map((num) => (
          <option key={num} value={num}>{num}</option>
        ))}
      </select>
            </div>
                  
                )}

                {displayMode === "Grid" && (
                  <div className="grid-options">
                    <div className="grid-setting">
                      <label className="text">Rows</label>
                      <select value={rows} onChange={(e) => setRows(e.target.value)} className="dropdown">
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid-setting">
                      <label className="text">Columns</label>
                      <select value={columns} onChange={(e) => setColumns(e.target.value)} className="dropdown">
                        {Array.from({ length: 9 }, (_, i) => i + 2).map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                )}
            

              <h3 className="text-highlight">Pagination</h3>
<div className="radio-groups">
  {["Numbered", "Load More"].map((type) => (
    <label key={type} className="radio-label">
      <input
        type="radio"
        name="paginationType"              // correct name here
        value={type}
        checked={paginationType === type}  // check paginationType state
        onChange={() => setPaginationType(type)}  // update paginationType state
      />
      <span className="radio-circle"></span>
      {type}
    </label>
  ))}
</div>

</div>



              {/* Right: Preview */}

          <div className="preview-container">
        
          <div className="preview-header">
        <h2 className="preview-title">Preview</h2>
        <button className="maximize-button" onClick={() => setIsMaximized(true)}>
          <img src="/images/maximize.png" alt="Maximize" className="maximize-icon" />
        </button>
      </div>



            {/* <div className="preview-content"></div> */}
            
                  
        <Preview2  searchType={searchType} />

            <span className="preview-footer">
        <img src="/images/amb.png" alt="Info Icon" className="info-icon" />
        Click the expand icon at the top <br></br> right for an enhanced view.
      </span>

          </div>



            </div>
              )}
          </div>
          </div>
        );
      }
