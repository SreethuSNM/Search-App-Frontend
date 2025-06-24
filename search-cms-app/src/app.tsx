import React, { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/navbar";
import Sidebar from "./components/sidebar";
import Choose from "./components/choose";
import Setup from "./components/setup";
import Finish from "./components/finish";
import { useAuth } from "./hooks/useAuth";
import ChooseSecond from "./components/choose2";
import Customizer from "./components/customizer";

import {
  fetchCollectionItems,
  fetchCollections,
  fetchSites,
} from "./services/api";
import PageSelect from "./components/selectpage";


type SetupConfig = {
  searchType:      "Expand" | "Icon";
  displayMode:     "List" | "Grid";
  itemsPerPage:    string;
  rows:            string;
  columns:         string;
  paginationType:  "Numbered" | "Load More";
};

function MainLayout({ children, activeStep, setActiveComponent }) {
  return (
    <div className="container">
      <Navbar />
      <div className="main-layout">
        <Sidebar
          activeStep={activeStep}
          setActiveComponent={setActiveComponent}
        />
        <div className="main-content">{children}</div>
      </div>
    </div>
  );
}

function App() {
  const [activeStep, setActiveStep] = useState(0);
  const { exchangeAndVerifyIdToken, sessionToken } = useAuth();

  const [collections, setCollections] = useState([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState("");
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [option, setOption] = useState("Collection");
   const [userOption, setUserOption] = useState("Collection filtering");
  const [selectedDisplayFields, setSelectedDisplayFields] = useState([]);
  const [selectedCollectionName, setSelectedCollectionName] = useState("");
  const [filterCollectionId, setFilterCollectionId] = useState("");
  const [filterCollectionName, setFilterCollectionName] = useState("");
  const [filterFields, setFilterFields] = useState([]);





  // 1. Define the shared setupConfig state in the parent:
const [setupConfig, setSetupConfig] = useState<SetupConfig>({
  searchType:      "Expand",
  displayMode:     "List",
  itemsPerPage:    "5",
  rows:            "3",
  columns:         "3",
  paginationType:  "Numbered",
});
  


  const handleSetActiveComponent = (component) => {
    if (component === "choose") setActiveStep(0);
    else if (component === "choose2") setActiveStep(1);
    else if (component === "setup") setActiveStep(2);
    else if (component === "customizer") setActiveStep(3);
     else if (component === "selectpage") setActiveStep(4);
    else if (component === "finish") setActiveStep(5);
  };

  useEffect(() => {
    const init = async () => {
      try {
        const data = localStorage.getItem("wf_hybrid_user");

        if (!data) {
          console.log("🔐 No existing auth. Exchanging token...");
          await exchangeAndVerifyIdToken();
        } else {
          console.log("✅ Auth found in localStorage, skipping token exchange.");
        }
      } catch (err) {
        console.error("⚠️ Auth init failed, retrying token exchange...");
        await exchangeAndVerifyIdToken();
      }
    };

    init();
  }, [exchangeAndVerifyIdToken]);

  // Load collections and restore selection from localStorage
  useEffect(() => {
    const loadCollections = async () => {
      try {
        setLoading(true);

        if (!sessionToken) {
          console.warn("⚠️ No session token. Cannot fetch data.");
          return;
        }

        const cachedCollections = localStorage.getItem("collections");
        if (cachedCollections) {
          setCollections(JSON.parse(cachedCollections));
        } else {
          const siteIdInfo = await webflow.getSiteInfo();

          if (!siteIdInfo?.siteId) {
            webflow.notify({ type: "Error", message: "Site ID not found." });
            return;
          }
          
          const siteId = siteIdInfo.siteId;

          console.log("siteid:::::",siteId)
          
          const result = await fetchCollections(sessionToken, siteId);
          setCollections(result);
          localStorage.setItem("collections", JSON.stringify(result));
        }

        const selected = JSON.parse(localStorage.getItem("selectedCollections") || "[]");
        setSelectedCollections(selected);

        const savedFields = JSON.parse(localStorage.getItem("selectedFields") || "[]");
        setSelectedFields(savedFields);
      } catch (e) {
        console.error("Failed to fetch collections:", e);
      } finally {
        setLoading(false);
      }
    };

    loadCollections();
  }, [sessionToken]);


  
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const pagesAndFolders = await webflow.getAllPagesAndFolders();
        if (Array.isArray(pagesAndFolders) && pagesAndFolders.length > 0) {
          const pages = pagesAndFolders.filter(i => i.type === "Page");
          console.log(pages)
          const pageDetails = await Promise.all(
            pages.map(async page => ({
              id: page.id,
              name: await page.getName(),
            }))
          );
         
          setPages(pageDetails);

          console.log("page details:", pageDetails)
          
        } else {
          console.warn("No pages found.");
        }
      } catch (error) {
        console.error("Error fetching pages:", error);
      }
    };
    fetchPages();
  }, [webflow]);

const [customStyle, setCustomStyle] = useState({
    borderRadius: "8px",
    titleColor: " #cf06aa",
    titleFontSize: "16px",
    otherFieldsFontWeight : "font-normal",
    titleFontFamily: "Arial",
    otherFieldsColor: " #00a619",
    otherFieldsFontSize: "14px",
     titleFontWeight : "font-bold",
    boxShadow: true, 
  });

  

  return (
    <MainLayout
      activeStep={activeStep}
      setActiveComponent={handleSetActiveComponent}
    >
      {activeStep === 0 && (
        <Choose
          setActiveComponent={handleSetActiveComponent}
          selectedCollectionName = {selectedCollectionName}
          setSelectedCollectionName={setSelectedCollectionName}
          collections={collections}
          selectedCollections={selectedCollections}
          setSelectedCollections={setSelectedCollections}
          selectedFields={selectedFields}
          setSelectedFields={setSelectedFields}
          sessionToken={sessionToken}
          fetchCollectionItems={fetchCollectionItems}
          option={option}
          setOption={setOption}
          userOption={userOption}
          setUserOption={setUserOption}
          selectedCollectionId={selectedCollectionId}
          setSelectedCollectionId={setSelectedCollectionId}
          filterCollectionId={filterCollectionId}
          filterCollectionName={filterCollectionName}
          filterFields={filterFields}
          setFilterCollectionId={setFilterCollectionId}
          setFilterCollectionName={setFilterCollectionName}
          setFilterFields={setFilterFields}
        />
      )}

         {activeStep === 1 && (
        <ChooseSecond
          setActiveComponent={handleSetActiveComponent}
          selectedCollections={selectedCollections}
          selectedFields={selectedFields}
          selectedDisplayFields={selectedDisplayFields}
          setSelectedDisplayFields={setSelectedDisplayFields}
          sessionToken={sessionToken}
          fetchCollectionItems={fetchCollectionItems}
          option={option}
        />
      )}

      {activeStep === 2 && <Setup 
      setActiveComponent={handleSetActiveComponent} 
      selectedCollections={selectedCollections}
      selectedFields={selectedFields}
      selectedDisplayFields={selectedDisplayFields}
      option={option}
       userOption={userOption}
       pages={pages}
      customStyle={customStyle}
      setupConfig={setupConfig}
      selectedCollectionId={selectedCollectionId}
  setSetupConfig={(partial) => setSetupConfig(prev => ({ ...prev, ...partial }))}
         
      
      />}

      {activeStep === 3 && (
  <Customizer
   setActiveComponent={handleSetActiveComponent} 
    customStyle={customStyle}
    setCustomStyle={setCustomStyle}
    selectedCollections={selectedCollections}
    selectedFields={selectedFields}
    selectedDisplayFields={selectedDisplayFields}
    option={option}
    userOption={userOption}
  setupConfig={setupConfig}
    pages={pages}
   filterCollectionId={filterCollectionId}
    filterCollectionName={filterCollectionName}
    filterFields={filterFields}
      
    />
)}
      
      {activeStep === 4 && <PageSelect
      selectedCollections={selectedCollections}
    selectedFields={selectedFields}
    selectedDisplayFields={selectedDisplayFields}
    option={option}
    userOption={userOption}
    customStyle={customStyle}
    setupConfig={setupConfig}
    pages={pages}
    selectedPage={selectedPage}
    setSelectedPage={setSelectedPage}
    setActiveComponent={handleSetActiveComponent}
    selectedCollectionName={selectedCollectionName}
    filterCollectionId={filterCollectionId}
    filterCollectionName={filterCollectionName}
          filterFields={filterFields}
      />}

       {activeStep === 5 && <Finish />}
    </MainLayout>
  );
}

export default App;
