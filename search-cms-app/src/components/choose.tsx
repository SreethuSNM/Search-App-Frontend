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
  selectedCollectionName,
  setSelectedCollectionName,
  userOption,
  setUserOption,
  option,
  setOption,
  selectedCollectionId,
  setSelectedCollectionId,
  filterCollectionId,
  filterCollectionName,
  filterFields,
  setFilterCollectionId,
  setFilterCollectionName,
  setFilterFields,
}) {
  const [selectAllCollections, setSelectAllCollections] = useState(true);
  const [selectAllFields, setSelectAllFields] = useState(true);
  const [fields, setFields] = useState([]);
  const [loadingFields, setLoadingFields] = useState(false);
const [selectAllSiteCollections, setSelectAllSiteCollections] = useState(true);
const [selectAllSiteFields, setSelectAllSiteFields] = useState(true);
const [selectAllFilterFields, setSelectAllFilterFields] = useState(true);

  const [loadingFilterFields, setLoadingFilterFields] = useState(true);
  const [loadingSiteFields, setLoadingSiteFields] = useState(true);
  const [siteFieldOptions, setSiteFieldOptions] = useState([]);
  const [filterFieldOptions, setFilterFieldOptions] = useState([]);

  useEffect(() => {
    localStorage.setItem("filterCollectionId", filterCollectionId);
  }, [filterCollectionId]);

  useEffect(() => {
    localStorage.setItem("filterFields", JSON.stringify(filterFields));
  }, [filterFields]);

  // Fetch fields for Site Search (now using selectedCollections, selectedFields)
  useEffect(() => {
    if (!sessionToken || selectedCollections.length === 0) return;

    let cancelled = false;
    setLoadingSiteFields(true);

    const loadFields = async () => {
      const fieldSet = new Set();
      for (const id of selectedCollections) {
        try {
          const items = await fetchCollectionItems(sessionToken, id);
          items.forEach((item) => {
            if (item.fieldData) {
              Object.keys(item.fieldData).forEach((k) => fieldSet.add(k));
            }
          });
        } catch (e) {
          console.error("Error fetching site search fields:", e);
        }
      }

      if (cancelled) return;

      const fieldArr = Array.from(fieldSet);
      setSiteFieldOptions(fieldArr);

      const validFields = selectedFields.filter((f) => fieldArr.includes(f));
      // setSelectedFields(validFields.length ? validFields : fieldArr);
      setSelectedFields(validFields);
      setSelectAllSiteFields(validFields.length === fieldArr.length);
      setLoadingSiteFields(false);
    };

    loadFields();
    return () => {
      cancelled = true;
    };
  }, [selectedCollections, sessionToken]);

  // Fetch fields for Collection Filtering
  useEffect(() => {
    if (!sessionToken || !filterCollectionId) return;

    let cancelled = false;
    setLoadingFilterFields(true);

    const loadFields = async () => {
      try {
        const items = await fetchCollectionItems(sessionToken, filterCollectionId);
        const fieldSet = new Set();
        items.forEach((item) => {
          if (item.fieldData) {
            Object.keys(item.fieldData).forEach((k) => fieldSet.add(k));
          }
        });

        if (cancelled) return;

        const fieldArr = Array.from(fieldSet);
        setFilterFieldOptions(fieldArr);

        const validFields = filterFields.filter((f) => fieldArr.includes(f));
        // setFilterFields(validFields.length ? validFields : fieldArr);
        setFilterFields(validFields);
        setSelectAllFilterFields(validFields.length === fieldArr.length);
        setLoadingFilterFields(false);
      } catch (e) {
        console.error("Error fetching filter fields:", e);
      }
    };

    loadFields();
    return () => {
      cancelled = true;
    };
  }, [filterCollectionId, sessionToken]);

  useEffect(() => {
    const selected = collections.find((c) => c.id === filterCollectionId);
    setSelectedCollectionName(selected?.displayName || "");
  }, [filterCollectionId]);

  const toggleSelection = (list, setList, all, setAll, item, fullList) => {
    const updated = list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
    setList(updated);
    setAll(updated.length === fullList.length);
  };

  const handleSelectAll = (all, setAll, setList, list) => {
    const nextAll = !all;
    setAll(nextAll);
    setList(nextAll ? list : []);
  };

  useEffect(() => {
    const selected = collections.find((c) => c.id === selectedCollectionId);
    setSelectedCollectionName(selected?.displayName || "");
  }, [selectedCollectionId]);

  return (
    <div className="choose-wrapper">
      <div className="choose-header">
        <button
          onClick={() => {
            if (option === "Collection" || option === "Both") {
              setActiveComponent("choose2");
            } else {
              setActiveComponent("setup");
            }
          }}
          className="continue-button"
        >
          Continue
        </button>
      </div>

      <hr className="separator-line" />

      <div className="choose-container">
        <div className="choose-content">
          <h1 className="choose-title">Choose Accordingly.</h1>

          {/* Collection Filtering Mode */}
          <div className="radio-group">
            {["Collection", "Pages", "Both"].map((item) => (
              <label key={item} className="radio-label">
                <input
                  type="radio"
                  value={item}
                  checked={option === item}
                  onChange={() => setOption(item)}
                />
                <span className={`radio-circle ${option === item ? "selected" : ""}`} />
                {item}
              </label>
            ))}
          </div>

          {(option === "Collection" || option === "Both") && (
            <>
              {/* 🔹 Site Search Section */}
              <div className="selection-boxes">
                <div className="selection-card">
                  <div className="selection-header">
                    <h2>Site Search - Collections</h2>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectAllSiteCollections}
                        onChange={() =>
                          handleSelectAll(
                            selectAllSiteCollections,
                            setSelectAllSiteCollections,
                            setSelectedCollections,
                            collections.map((c) => c.id)
                          )
                        }
                      />{" "}
                      All
                    </label>
                  </div>
                  {collections.map((collection) => (
                    <label key={collection.id} className="selection-item">
                      <input
                        type="checkbox"
                        checked={selectedCollections.includes(collection.id)}
                        onChange={() =>
                          toggleSelection(
                            selectedCollections,
                            setSelectedCollections,
                            selectAllSiteCollections,
                            setSelectAllSiteCollections,
                            collection.id,
                            collections.map((c) => c.id)
                          )
                        }
                      />
                      <span>{collection.displayName}</span>
                    </label>
                  ))}
                </div>

                <div className="selection-card">
                  <div className="selection-header">
                    <h2>Site Search - Fields</h2>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectAllSiteFields}
                        onChange={() =>
                          handleSelectAll(
                            selectAllSiteFields,
                            setSelectAllSiteFields,
                            setSelectedFields,
                            siteFieldOptions
                          )
                        }
                      />{" "}
                      All
                    </label>
                  </div>
                  {loadingSiteFields ? (
                    <p>Loading...</p>
                  ) : (
                    siteFieldOptions.map((field) => (
                      <label key={field} className="selection-item">
                        <input
                          type="checkbox"
                          checked={selectedFields.includes(field)}
                          onChange={() =>
                            toggleSelection(
                              selectedFields,
                              setSelectedFields,
                              selectAllSiteFields,
                              setSelectAllSiteFields,
                              field,
                              siteFieldOptions
                            )
                          }
                        />
                        <span>{field}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            </>
          )}

         
        </div>
      </div>
    </div>
  );
}
