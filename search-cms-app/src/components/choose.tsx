import React, { useEffect, useState } from "react";
import "../styles/choose.css";

export default function Choose({
  setActiveComponent,
  collections,
  selectedCollections,
  setSelectedCollections,
  selectedFields,
  setSelectedFields,
  sessionToken,
  fetchCollectionItems,
  pages, 
  selectedPage, 
  setSelectedPage
}) {
  const [selectAllCollections, setSelectAllCollections] = useState(true);
  const [selectAllFields, setSelectAllFields] = useState(true);
  const [fields, setFields] = useState([]);
  const [loadingFields, setLoadingFields] = useState(false);
  const [option, setOption] = useState("Collection");

  useEffect(() => {
    if (collections.length && selectedCollections.length === 0) {
      const allCollectionIds = collections.map((c) => c.id);
      setSelectedCollections(allCollectionIds);
      setSelectAllCollections(true);
    }
  }, [collections]);

  const toggleSelection = (type, id) => {
    if (type === "collection") {
      const updated = selectedCollections.includes(id)
        ? selectedCollections.filter((c) => c !== id)
        : [...selectedCollections, id];
      setSelectedCollections(updated);
    } else {
      const updated = selectedFields.includes(id)
        ? selectedFields.filter((f) => f !== id)
        : [...selectedFields, id];
      setSelectedFields(updated);
    }
  };

  const handleSelectAll = (type) => {
    if (type === "collection") {
      const all = !selectAllCollections;
      setSelectAllCollections(all);
      const newSelected = all ? collections.map((c) => c.id) : [];
      setSelectedCollections(newSelected);
    } else {
      const all = !selectAllFields;
      setSelectAllFields(all);
      setSelectedFields(all ? fields : []);
    }
  };

  useEffect(() => {
    const fetchFields = async () => {
      if (!sessionToken || selectedCollections.length === 0) {
        setFields([]);
        setSelectedFields([]);
        return;
      }

      setLoadingFields(true);
      const fieldSet = new Set();
      for (const collectionId of selectedCollections) {
        try {
          const items = await fetchCollectionItems(sessionToken, collectionId);
          items.forEach((item) => {
            if (item.fieldData) {
              Object.keys(item.fieldData).forEach((key) => fieldSet.add(key));
            }
          });
        } catch (e) {
          console.error(`Error fetching items for collection ${collectionId}:`, e);
        }
      }

      const newFields = Array.from(fieldSet);
      setFields(newFields);
      setSelectedFields(newFields);
      setSelectAllFields(true);
      setLoadingFields(false);
    };

    fetchFields();
  }, [selectedCollections, sessionToken, fetchCollectionItems, setSelectedFields]);

  useEffect(() => {
    localStorage.setItem("selectedCollections", JSON.stringify(selectedCollections));
  }, [selectedCollections]);

  useEffect(() => {
    localStorage.setItem("selectedFields", JSON.stringify(selectedFields));
  }, [selectedFields]);


  const handlePageChange = async (event) => {
    const pageId = event.target.value;
    const selected = pages.find((p) => p.id === pageId);
    if (selected) {
      setSelectedPage(selected);
      try {
        await webflow.switchPage(selected);
      } catch (error) {
        console.error("Failed to switch page:", error);
      }
    }
  };



  return (
    <div className="choose-wrapper">
      <div className="choose-header">
        <button onClick={() => setActiveComponent("setup")} className="continue-button">
          Continue
        </button>
        {/* <button onClick={Createinput}>Create Input</button> */}
      </div>

      <hr className="separator-line" />

      <div className="choose-container">
        <div className="choose-content">
          <h1 className="choose-title">Choose Accordingly</h1>


          

           {/* Radio Options */}
        <div className="radio-group">
          {["Collection", "Pages", "Collection + Pages"].map((item) => (
            <label key={item} className="radio-label">
              <input
                type="radio"
                value={item}
                checked={option === item}
                onChange={() => setOption(item)}
              />
              <span className={`radio-circle ${option === item ? "selected" : ""}`}></span>
              {item}
            </label>
          ))}
        </div>

        <div className="selection-boxes">
        <div className="selection-card">
        <div className="selection-header">

        <h2>Choose the Page to Place Your Search Form</h2>
        </div>
      <select onChange={handlePageChange} value={selectedPage?.id || ""}>
        <option value="" disabled>Select a page</option>
        {pages.map((page) => (
          <option key={page.id} value={page.id}>
            {page.name}
          </option>
        ))}
      </select>
      </div>
      </div>
    
          <div className="selection-boxes">


          
            <div className="selection-card">
              <div className="selection-header">
                <h2>Choose collections</h2>
                <label>
                  <input
                    type="checkbox"
                    checked={selectAllCollections}
                    onChange={() => handleSelectAll("collection")}
                  />
                  All
                </label>
              </div>
              {collections.map((collection) => (
                <label key={collection.id} className="selection-item">
                  <input
                    type="checkbox"
                    checked={selectedCollections.includes(collection.id)}
                    onChange={() => toggleSelection("collection", collection.id)}
                  />
                  <span>{collection.displayName}</span>
                </label>
              ))}
            </div>

            <div className="selection-card">
              <div className="selection-header">
                <h2>Choose fields</h2>
                <label>
                  <input
                    type="checkbox"
                    checked={selectAllFields}
                    onChange={() => handleSelectAll("field")}
                  />
                  All
                </label>
              </div>
              {loadingFields ? (
                <div>Loading fields...</div>
              ) : (
                fields.map((field) => (
                  <label key={field} className="selection-item">
                    <input
                      type="checkbox"
                      checked={selectedFields.includes(field)}
                      onChange={() => toggleSelection("field", field)}
                    />
                    <span>{field}</span>
                  </label>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
