import React, { useState, useEffect, useRef } from "react";
import iro from "@jaames/iro";
import "../styles/customize.css";

const fontFamilies = ["Arial", "Georgia", "Times New Roman", "Verdana", "Courier New"];

export default function Customizer({  setActiveComponent, customStyle, setCustomStyle }) {
  const [borderRadius, setBorderRadius] = useState("8px");
  const [titleColor, setTitleColor] = useState(" #cf06aa");
  const [titleFontSize, setTitleFontSize] = useState("16px");
  const [titleFontFamily, setTitleFontFamily] = useState("Arial");
  const [otherFieldsColor, setOtherFieldsColor] = useState(" #00a619");
  const [otherFieldsFontSize, setOtherFieldsFontSize] = useState("14px");
  const [boxShadowEnabled, setBoxShadowEnabled] = useState(true);


  const titleColorRef = useRef<HTMLDivElement>(null);
  const otherColorRef = useRef<HTMLDivElement>(null);
  const titleColorPicker = useRef<iro.ColorPicker>();
  const otherColorPicker = useRef<iro.ColorPicker>();



  useEffect(() => {
    if (titleColorRef.current && !titleColorPicker.current) {
      titleColorPicker.current = iro.ColorPicker(titleColorRef.current, {
        width: 100,
        color: titleColor,
      });
      titleColorPicker.current.on("color:change", (color) => {
        setTitleColor(color.hexString);
      });
    }

    if (otherColorRef.current && !otherColorPicker.current) {
      otherColorPicker.current = iro.ColorPicker(otherColorRef.current, {
        width: 100,
        color: otherFieldsColor,
      });
      otherColorPicker.current.on("color:change", (color) => {
        setOtherFieldsColor(color.hexString);
      });
    }
  }, []);

const didMountRef = useRef(false);

useEffect(() => {
  if (didMountRef.current) {
    setCustomStyle({
      borderRadius,
      titleColor,
      titleFontSize,
      titleFontFamily,
      otherFieldsColor,
      otherFieldsFontSize,
      boxShadow: boxShadowEnabled, 
    });
  } else {
    didMountRef.current = true;
  }
}, [
  borderRadius,
  titleColor,
  titleFontSize,
  titleFontFamily,
  otherFieldsColor,
  otherFieldsFontSize,
  boxShadowEnabled,
]);





  return (
   <div className="choose-wrapper">
      <div className="choose-header">
        <button onClick={() => setActiveComponent("setup")} className="continue-button">
          Continue
        </button>
      </div>

      <hr className="separator-line" />

      {/* Two-column layout */}
      <div className="choose-container" style={{ display: "flex", gap: "2rem" }}>
        {/* Left: Controls */}
        <div style={{ flex: 1 }}>
          <h1 className="choose-title">Customize Display Style</h1>

          <div className="form-group">
            <label>Border Radius</label>
            <input
              type="text"
              value={borderRadius}
              onChange={(e) => setBorderRadius(e.target.value)}
              placeholder="e.g. 8px or 0.5rem"
            />
          </div>

         <div className="form-group">
  <label >
    Box Shadow</label>
    <div style={{ display: "flex", alignItems: "center" }}>
      <div
        className={`switch ${boxShadowEnabled ? "on" : ""}`}
        onClick={() => setBoxShadowEnabled((prev) => !prev)}
      >
        <div className="slider" />
      </div>
      <div className="switch-label">{boxShadowEnabled ? "On" : "Off"}</div>
    </div>

</div>



          <div className="form-group">
            <label>Title Font Size</label>
            <input
              type="text"
              value={titleFontSize}
              onChange={(e) => setTitleFontSize(e.target.value)}
              placeholder="e.g. 18px"
            />
          </div>

          <div className="form-group">
            <label>Title Font Family</label>
            <select value={titleFontFamily} onChange={(e) => setTitleFontFamily(e.target.value)}>
              {fontFamilies.map((font) => (
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
              onChange={(e) => setOtherFieldsFontSize(e.target.value)}
              placeholder="e.g. 14px"
            />
          </div>

          <div className="form-group color-row">
            <label>Title Color</label>
            <div className="color-picker-wrapper">
              <div ref={titleColorRef} className="color-picker"></div>
              <div className="color-selected" style={{ color: titleColor }}>
                Selected: {titleColor}
              </div>
            </div>
          </div>

          <div className="form-group color-row">
            <label>Content Color</label>
            <div className="color-picker-wrapper">
              <div ref={otherColorRef} className="color-picker"></div>
              <div className="color-selected" style={{ color: otherFieldsColor }}>
                Selected: {otherFieldsColor}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div style={{
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center", 
    justifyContent: "center", 

  }}>
     
           <h1 className="choose-title">Live Preview</h1>
          <div
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              borderRadius,
              background: "#f9f9f9",
              height:"250px",
              boxShadow: boxShadowEnabled ? "0 4px 8px rgba(0,0,0,0.1)" : "none",
            }}
          >
            <div
              style={{
                color: titleColor,
                fontSize: titleFontSize,
                fontFamily: titleFontFamily,
                fontWeight: "bold",
                marginBottom: "0.5rem",
                marginTop: "0.5rem",
              }}
            >
              Title Example
            </div>
            <div style={{ color: otherFieldsColor, fontSize: otherFieldsFontSize ,padding:"5px", }}>
              This is how your field text will appear. Adjust the settings to preview changes.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
