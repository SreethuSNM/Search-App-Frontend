"use client";
import React, { useState } from "react";
import "../styles/setup.css";
import Preview from "./preview";
import Preview2 from "./preview2";

type SetupConfig = {
  searchType:      "Expand" | "Icon";

  displayMode:     "List" | "Grid";
  itemsPerPage:    string;
  rows:            string;
  columns:         string;
  paginationType:  "Numbered" | "Load More";
};

type Props = {
  setActiveComponent: (c: string) => void;
  selectedCollections: any[];
  selectedFields: any[];
  selectedDisplayFields: any[];
  selectedCollectionId:string;
  option: string;
  userOption:string;
  customStyle: any;
  pages: any;
  setupConfig: SetupConfig;
  setSetupConfig: (partial: Partial<SetupConfig>) => void;
};

export default function Setup({
  setActiveComponent,
  selectedCollections,
  selectedFields,
  selectedDisplayFields,
  option,
  pages,
  userOption,
  customStyle,
  selectedCollectionId,
  setupConfig,
  setSetupConfig,
}: Props) {
  // only local UI toggle state:
  const [isMaximized, setIsMaximized] = useState(false);

  // helper to update parent state:
  const setValue = <K extends keyof SetupConfig>(key: K, value: SetupConfig[K]) => {
    setSetupConfig({ [key]: value });
  };

  // pull all values from parent:
  const {
    searchType,
    // resultType,
    // resultPage,
    displayMode,
    itemsPerPage,
    rows,
    columns,
    paginationType,
  } = setupConfig;




  return (
    <div className="setup-wrapper">
      <div className="choose-header">
        <button
          onClick={() => {
            
            setActiveComponent("customizer");
          }}
          className="continue-button"
        >
          Continue
        </button>
      </div>
      <hr className="separator-line" />

      <div className="component-container">
        {isMaximized ? (
          <Preview
            onMinimize={() => setIsMaximized(false)}
            searchType={searchType}
            // resultType={resultType}
          />
        ) : (
          <div className="inner-container">
            {/* Left: Settings */}
            <div className="settings-container">
              <h3 className="text-highlight">Search Bar</h3>
              <div className="radio-groups">
                {(["Expand", "Icon"] as const).map((type) => (
                  <label key={type} className="radio-label">
                    <input
                      type="radio"
                      name="searchType"
                      value={type}
                      checked={searchType === type}
                      onChange={() =>
                        setValue("searchType", type as SetupConfig["searchType"])
                      }
                    />
                    <span className="radio-circle" />
                    {type}
                  </label>
                ))}
              </div>


              

              <h3 className="text-highlight">Result Display</h3>
              <div className="display-toggle">
                <button
                  className={`toggle-btn ${displayMode === "List" ? "active" : ""}`}
                  onClick={() =>
                    setValue("displayMode", "List" as SetupConfig["displayMode"])
                  }
                >
                  <img src="/images/list.png" alt="List View" className="icon" />
                  <span className="text">List</span>
                </button>
                <button
                  className={`toggle-btn ${displayMode === "Grid" ? "active" : ""}`}
                  onClick={() =>
                    setValue("displayMode", "Grid" as SetupConfig["displayMode"])
                  }
                >
                  <img src="/images/grid.png" alt="Grid View" className="icon" />
                  <span className="text">Grid</span>
                </button>
              </div>

              {displayMode === "List" ? (
                <div className="list-container">
                  <h2 className="list-title">Number of Items</h2>
                  <select
                    value={itemsPerPage}
                    onChange={(e) =>
                      setValue(
                        "itemsPerPage",
                        e.target.value as SetupConfig["itemsPerPage"]
                      )
                    }
                    className="dropdown"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i} value={(i + 1).toString()}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="grid-options">
                  <div className="grid-setting">
                    <label className="text">Rows</label>
                    <select
                      value={rows}
                      onChange={(e) =>
                        setValue("rows", e.target.value as SetupConfig["rows"])
                      }
                      className="dropdown"
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i} value={(i + 1).toString()}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid-setting">
                    <label className="text">Columns</label>
                    <select
                      value={columns}
                      onChange={(e) =>
                        setValue("columns", e.target.value as SetupConfig["columns"])
                      }
                      className="dropdown"
                    >
                      {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <option key={n} value={n.toString()}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
 
              <h3 className="text-highlight">Pagination</h3>
              <div className="radio-groups">
                {(["Numbered", "Load More"] as const).map((type) => (
                  <label key={type} className="radio-label">
                    <input
                      type="radio"
                      name="paginationType"
                      value={type}
                      checked={paginationType === type}
                      onChange={() =>
                        setValue(
                          "paginationType",
                          type as SetupConfig["paginationType"]
                        )
                      }
                    />
                    <span className="radio-circle" />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            {/* Right: Preview */}
            <div className="preview-container">
              <div className="preview-header">
                <h2 className="preview-title">Preview</h2>
                <button
                  className="maximize-button"
                  onClick={() => setIsMaximized(true)}
                >
                  <img src="/images/maximize.png" alt="Maximize" className="maximize-icon" />
                </button>
              </div>
              <Preview2 searchType={searchType} />
              <span className="preview-footer">
                <img src="/images/amb.png" alt="Info Icon" className="info-icon" />
                Click the expand icon at the top right for an enhanced view.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
