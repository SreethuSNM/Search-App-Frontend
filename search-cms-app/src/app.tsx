import React, { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/navbar";
import Sidebar from "./components/sidebar";
import Choose from "./components/choose";
import Setup from "./components/setup";
import Finish from "./components/finish";
import { useAuth } from "./hooks/useAuth";
import {
  fetchCollectionItems,
  fetchCollections,
  fetchSites,
} from "./services/api";

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
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);

  const handleSetActiveComponent = (component) => {
    if (component === "choose") setActiveStep(0);
    else if (component === "setup") setActiveStep(1);
    else if (component === "finish") setActiveStep(2);
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
          const sites = await fetchSites(sessionToken);
          const siteId = sites?.[0]?.id;
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
  return (
    <MainLayout
      activeStep={activeStep}
      setActiveComponent={handleSetActiveComponent}
    >
      {activeStep === 0 && (
        <Choose
          setActiveComponent={handleSetActiveComponent}
          collections={collections}
          selectedCollections={selectedCollections}
          setSelectedCollections={setSelectedCollections}
          selectedFields={selectedFields}
          setSelectedFields={setSelectedFields}
          sessionToken={sessionToken}
          fetchCollectionItems={fetchCollectionItems}
          pages={pages}
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
        />
      )}
      {activeStep === 1 && <Setup setActiveComponent={handleSetActiveComponent} />}
      {activeStep === 2 && <Finish />}
    </MainLayout>
  );
}

export default App;
