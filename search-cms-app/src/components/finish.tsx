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



export default function Finish(){

  return (
   
      <div className="finish-card">
        {/* Icon Section */}
        <div className="icons-container ">
          <img src="/images/union.png" alt="Verified" className="icon-union" />
          <img src="/images/setting-2.png" alt="Setting" className="icon-large" />
          <img src="/images/setting-2.png" alt="Setting" className="icon-small" />
        </div>
{/* 

       

        {/* Text Section */}
        <h2 className="finish-title">Setup Completed.</h2>
        <p className="finish-text">
          Your search is now ready to go.
          You can check   <br /> your staging website.
        </p>

      
       
      <button className="finish-button">Back to webflow</button>
      
    
    </div>
  );
}
