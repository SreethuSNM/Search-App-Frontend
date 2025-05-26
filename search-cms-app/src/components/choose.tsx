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
  setSelectedPage,
  option,
  setOption
}) {
  const [selectAllCollections, setSelectAllCollections] = useState(true);
  const [selectAllFields, setSelectAllFields] = useState(true);
  const [fields, setFields] = useState([]);
  const [loadingFields, setLoadingFields] = useState(false);
 
  // Restore from localStorage once collections are available
  useEffect(() => {
    if (!collections.length) return;

    const savedCollections = JSON.parse(localStorage.getItem("selectedCollections") || "[]");
    const savedFields = JSON.parse(localStorage.getItem("selectedFields") || "[]");

    if (savedCollections.length > 0) {
      setSelectedCollections(savedCollections);
      setSelectAllCollections(savedCollections.length === collections.length);
    } else {
      const allCollectionIds = collections.map((c) => c.id);
      setSelectedCollections(allCollectionIds);
      setSelectAllCollections(true);
    }

    setSelectedFields(savedFields);
  }, [collections]);

  // Persist selections to localStorage
  useEffect(() => {
    localStorage.setItem("selectedCollections", JSON.stringify(selectedCollections));
  }, [selectedCollections]);

  useEffect(() => {
    localStorage.setItem("selectedFields", JSON.stringify(selectedFields));
  }, [selectedFields]);

  // Fetch fields from selected collections
 useEffect(() => {
  let isCancelled = false;

  const fetchFields = async () => {
    if (!sessionToken || selectedCollections.length === 0) {
      setFields([]);
      setSelectedFields([]);
      setSelectAllFields(false);
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
      } catch (error) {
        console.error(`Error fetching items for collection ${collectionId}:`, error);
      }
    }

    if (isCancelled) return;

    const newFields = Array.from(fieldSet);
    setFields(newFields);

    const validFields = selectedFields.filter((f) => newFields.includes(f));
    setSelectedFields(validFields);
    setSelectAllFields(validFields.length === newFields.length);

    // Cache
    const key = selectedCollections.sort().join(",");
    const cached = JSON.parse(localStorage.getItem("fieldsForCollections") || "{}");
    cached[key] = { fields: newFields, selectedFields: validFields };
    localStorage.setItem("fieldsForCollections", JSON.stringify(cached));

    setLoadingFields(false);
  };

  fetchFields();

  return () => {
    isCancelled = true;
  };
}, [selectedCollections, sessionToken, fetchCollectionItems]);


  const toggleSelection = (type, id) => {
    if (type === "collection") {
      const updated = selectedCollections.includes(id)
        ? selectedCollections.filter((c) => c !== id)
        : [...selectedCollections, id];
      setSelectedCollections(updated);
      setSelectAllCollections(updated.length === collections.length);
    } else {
      const updated = selectedFields.includes(id)
        ? selectedFields.filter((f) => f !== id)
        : [...selectedFields, id];
      setSelectedFields(updated);
      setSelectAllFields(updated.length === fields.length);
    }
  };

  const handleSelectAll = (type) => {
    if (type === "collection") {
      const all = !selectAllCollections;
      setSelectedCollections(all ? collections.map((c) => c.id) : []);
      setSelectAllCollections(all);
    } else {
      const all = !selectAllFields;
      setSelectedFields(all ? fields : []);
      setSelectAllFields(all);
    }
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
    <div className="choose-wrapper">
      <div className="choose-header">
      <button onClick={() => {setActiveComponent("choose2");}}className="continue-button">Continue</button>

       
      </div>

      <hr className="separator-line" />

      <div className="choose-container">
        <div className="choose-content">
          <h1 className="choose-title">Choose Accordingly</h1>
           {/* Radio Options */}
        <div className="radio-group">
          {["Collection", "Pages", "Both"].map((item) => (
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
              {!loadingFields &&
                  fields.map((field) => (
                  <label key={field} className="selection-item">
                    <input
                      type="checkbox"
                      checked={selectedFields.includes(field)}
                      onChange={() => toggleSelection("field", field)}
                    />
                    <span>{field}</span>
                  </label>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
