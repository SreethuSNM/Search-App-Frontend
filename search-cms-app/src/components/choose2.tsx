import React, { useEffect, useState } from "react";
import "../styles/choose.css";
import "../styles/choose2.css";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable Item for Drag-and-Drop
function SortableItem({ id }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: "8px",
    border: "1px solid #8B77F9",
    borderRadius: "4px",
    marginBottom: "5px",
    fontSize: "14px", 
    
cursor: "move",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {id}
    </div>
  );
}

export default function ChooseSecond({
  setActiveComponent,
  selectedFields,
  option,
  selectedCollections,
  sessionToken,
  fetchCollectionItems,
  selectedDisplayFields,
  setSelectedDisplayFields,
}) {
  const [fields, setFields] = useState([]);
  const [loadingFields, setLoadingFields] = useState(false);
  const [selectAllDisplayFields, setSelectAllDisplayFields] = useState(true);

  const sensors = useSensors(useSensor(PointerSensor));

  

 useEffect(() => {
    if (!sessionToken || selectedCollections.length === 0) {
      setFields([]);
      setSelectedDisplayFields([]);
      setSelectAllDisplayFields(false);
      setLoadingFields(false);
      return;
    }

    const fetchFields = async () => {
      setLoadingFields(true);
      const fieldSet = new Set();

      try {
        const allItemsByCollection = await Promise.all(
          selectedCollections.map((collectionId) =>
            fetchCollectionItems(sessionToken, collectionId)
          )
        );

        allItemsByCollection.forEach((items) => {
          if (Array.isArray(items)) {
            items.forEach((item) => {
              if (item?.fieldData && typeof item.fieldData === "object") {
                Object.keys(item.fieldData).forEach((key) => fieldSet.add(key));
              }
            });
          }
        });

        const newFields = Array.from(fieldSet);

        // Restore from localStorage or select all by default
        const saved = JSON.parse(
          localStorage.getItem("selectedDisplayFields") || "[]"
        );
        const validSaved = saved.filter((f) => newFields.includes(f));
        const defaults = validSaved.length ? validSaved : newFields;

        setFields(newFields);
        setSelectedDisplayFields(defaults);
        setSelectAllDisplayFields(defaults.length === newFields.length);
      } catch (error) {
        console.error("Error fetching fields:", error);
      } finally {
        setLoadingFields(false);
      }
    };

    fetchFields();
  }, [selectedCollections, sessionToken, fetchCollectionItems, setSelectedDisplayFields]);

  useEffect(() => {
    localStorage.setItem(
      "selectedDisplayFields",
      JSON.stringify(selectedDisplayFields)
    );
  }, [selectedDisplayFields]);

  const toggleDisplayField = (field) => {
    console.log("Toggle field:", field);
    const updated = selectedDisplayFields.includes(field)
      ? selectedDisplayFields.filter((f) => f !== field)
      : [...selectedDisplayFields, field];
    setSelectedDisplayFields(updated);
    setSelectAllDisplayFields(updated.length === fields.length);
  };

  const handleSelectAllDisplay = () => {
    const all = !selectAllDisplayFields;
    console.log("Select all display fields:", all);
    setSelectedDisplayFields(all ? fields : []);
    setSelectAllDisplayFields(all);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = selectedDisplayFields.indexOf(active.id);
      const newIndex = selectedDisplayFields.indexOf(over.id);
      console.log(`Drag from ${oldIndex} to ${newIndex}`, active.id, over.id);
      setSelectedDisplayFields(arrayMove(selectedDisplayFields, oldIndex, newIndex));
    }
  };


  return (
    <div className="choose-wrapper">
      <div className="choose-header">
        <button onClick={() => setActiveComponent("customizer")} className="continue-button">
          Continue
        </button>
      </div>

      <hr className="separator-line" />

      <div className="selection-boxes">
        <div className="selection-cardd">
          <div className="selection-header">
            <h2>Choose Fields to Display in Results</h2>
            <label>
              <input
                type="checkbox"
                checked={selectAllDisplayFields}
                onChange={handleSelectAllDisplay}
              />
              All
            </label>
          </div>

          {!loadingFields &&
                  fields.map((field) => (
              <label key={field} className="selection-item">
                <input
                  type="checkbox"
                  checked={selectedDisplayFields.includes(field)}
                  onChange={() => toggleDisplayField(field)}
                />
                <span>{field}</span>
              </label>
            ))}
        </div>

        {selectedDisplayFields.length > 0 && (
         <div
    className="selection-cardd"
    
  >
          <div className="selection-header" >
            
            <h2>Selected Display Field Order(Drag & Drop)</h2>
        
            </div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={selectedDisplayFields} strategy={verticalListSortingStrategy}>
                {selectedDisplayFields.map((field) => (
                  <SortableItem key={field} id={field} />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        )}
      </div>
    </div>
  );
}
