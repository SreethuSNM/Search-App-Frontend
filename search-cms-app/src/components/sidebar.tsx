import React from "react";
import "../styles/sidebar.css"; // Correct path

export default function Sidebar({ setActiveComponent, activeStep }) {
  const progressMap = [0, 10, 20, 50, 80, 100];
  const progressPercent = progressMap[activeStep] || 0;

  return (
    <aside className="sidebar">
      {/* Progress Bar */}
      <div className="progress-text">{progressPercent}% Completed</div>

      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* Step Indicators */}
        <div className="progress-indicators">
          {progressMap.map((_, index) => (
            <span
              key={index}
              className={`progress-dot ${
                index <= activeStep ? "active-dot" : ""
              }`}
            ></span>
          ))}
        </div>
      </div>

      <hr className="separator-linee" />

     <nav className="sidebar-nav">
  {/* Choose Step */}
  <div
    className={`sidebar-item ${activeStep === 0 ? "active" : ""}`}
    onClick={() => setActiveComponent("choose")}
  >
    <div className="icon-container">
      <img src="images/setting.png" alt="Settings" className="icon" />
    </div>
    <span className="sidebar-text">Choose Search</span>
  </div>

  {/* ChooseSecond Step */}
  <div
    className={`sidebar-item ${activeStep === 1 ? "active" : ""}`}
    onClick={() => setActiveComponent("choose2")}
  >
    <div className="icon-container">
      <img src="images/setting.png" alt="Settings" className="icon" />
    </div>
    <span className="sidebar-text">Choose Display</span>
  </div>
 {/* Setup Step */}
  <div
    className={`sidebar-item ${activeStep === 2 ? "active" : ""}`}
    onClick={() => setActiveComponent("setup")}
  >
    <div className="icon-container">
      <img src="images/grid-edit.png" alt="Setup" className="icon" />
    </div>
    <span className="sidebar-text">Setup</span>
  </div>

  {/* Customizer Step */}
  <div
    className={`sidebar-item ${activeStep === 3 ? "active" : ""}`}
    onClick={() => setActiveComponent("customizer")}
  >
    <div className="icon-container">
      <img src="images/grid-edit.png" alt="Customize Display" className="icon" />
    </div>
    <span className="sidebar-text">Customize Display</span>
  </div>

   {/* Customizer Step */}
  <div
    className={`sidebar-item ${activeStep === 4 ? "active" : ""}`}
    onClick={() => setActiveComponent("selectpage")}
  >
    <div className="icon-container">
      <img src="images/grid-edit.png" alt="Customize Display" className="icon" />
    </div>
    <span className="sidebar-text">SelectPage</span>
  </div>

 
  {/* Finish Step - only render if activeStep === 4 */}
{activeStep === 5 && (
  <div
    className="sidebar-item active"
    onClick={() => setActiveComponent("finish")}
  >
    <div className="icon-container">
      <img src="images/finish.png" alt="Finish" className="icon" />
    </div>
    <span className="sidebar-text">Finish</span>
  </div>
)}
</nav>

    </aside>
  );
}
