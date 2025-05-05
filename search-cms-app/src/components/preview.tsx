import React, { useState, useRef, useEffect } from "react";
import "../styles/preview.css";
import { useAuth } from "../hooks/useAuth";
import { fetchSearchIndex, fetchSites } from "../services/api";


export default function Preview({ onMinimize , searchType , resultType }) {
  const { sessionToken } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false); // New state for expanded search input
  const [isMaximized, setIsMaximized] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (resultType !== "Auto result") return;
  
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
  
    debounceTimeout.current = setTimeout(() => {
      if (query.trim()) {
        handleSearch();
      }
    }, 500); // 500ms debounce
  }, [query, resultType]);
  



  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = async () => {
    if (!sessionToken) {
      console.error("No session token available.");
      setError("No session token available.");
      return;
    }

    if (!query.trim()) {
      setError("Please enter a search query");
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const sites = await fetchSites(sessionToken);
      if (!sites || sites.length === 0) {
        setError("No sites found.");
        return;
      }

      const siteId = sites[0]?.id;
      if (!siteId) {
        setError("Site ID not found.");
        return;
      }

      const searchResults = await fetchSearchIndex(sessionToken, query, siteId);
      setResults(searchResults);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching search results");
    } finally {
      setLoading(false);
    }
  };

  const extractSnippet = (text: string, query: string): JSX.Element => {
    const cleaned = text.replace(/\s+/g, " ").trim();
    const lowerText = cleaned.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const matchIndex = lowerText.indexOf(lowerQuery);
  
    if (matchIndex === -1) return <></>;
  
    const matchLength = query.length;
    const snippetStart = Math.max(0, matchIndex - 30);
    const snippetEnd = Math.min(cleaned.length, matchIndex + matchLength + 30);
    const snippet = cleaned.substring(snippetStart, snippetEnd);
  
    // Calculate positions relative to the snippet
    const before = snippet.substring(0, matchIndex - snippetStart);
    const match = snippet.substring(matchIndex - snippetStart, matchIndex - snippetStart + matchLength);
    const after = snippet.substring(matchIndex - snippetStart + matchLength);
  
    return (
      <>
        {before}
        <mark>{match}</mark>
        {after}
      </>
    );
  };
  

  return (
    <div className={`preview-containers ${isMaximized ? 'maximized' : ''}`}>
      <div className="preview-header">
        <h2 className="preview-title">Preview</h2>
        <button className="maximize-button" onClick={onMinimize}>
          <img src="/images/minimize.png" alt="Maximize" className="maximize-icon" />
        </button>

        
      </div>

      <div className="preview-card">
        <div className="browser-header">
          <img src="/images/preview.png" alt="Preview" className="browser-image" />
        </div>

        <div className="search-container">
        {searchType === "Expand" ? (
        <div className="expanded-search-bar">
              {/* Expanded Search Bar */}
          <div className="search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search..."
              value={query}
              onChange={handleSearchChange}
            />
            <button className="search-button" onClick={handleSearch}disabled={resultType === "Auto result"}>
              <img src="/images/searchh.png" alt="Search" className="search-icon" />
            </button>
          </div>
          </div>
        ) : (<div className="icon-search-bar">
              {/* Icon Search Bar */}
              {!isExpanded && (
                <button className="search-icon-btn" onClick={() => setIsExpanded(true)}>
                  <img src="/images/search-normal.png" alt="Search Icon" />
                </button>
              )}

              {/* Conditionally render expanded input field */}
              {isExpanded && (
                <div className="search-bar">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search..."
                  value={query}
                  onChange={handleSearchChange}
                />
                <button className="search-button" onClick={handleSearch} disabled={resultType === "Auto result"}>
                  <img src="/images/searchh.png" alt="Search" className="search-icon" />
                </button>
              </div>
              )}
            </div>
          )}
        </div>
            
       
      

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="search-results">
          {results
            .filter(
              (result) =>
                result.matchedText &&
                result.matchedText.toLowerCase().includes(query.toLowerCase())
            )
            .map((result, index) => (
              <div key={index} className="result-item">
                <span className="result-title" style={{ marginRight: "10px", fontWeight: "bold" }}>
                  {result.title}
                </span>
                <span style={{ marginRight: "10px", fontStyle: "italic", color: "gray" }}>
                {result.publishedPath ? (
  <a
    href={result.publishedPath.startsWith("http") ? result.publishedPath : `https://${result.publishedPath}`}
    target="_blank"
    rel="noopener noreferrer"
    style={{ marginRight: "10px", fontStyle: "italic", color: "#4a90e2", textDecoration: "underline" }}
  >
    {result.publishedPath}
  </a>
) : (
  <span style={{ marginRight: "10px", fontStyle: "italic", color: "gray" }}>
    Path not available
  </span>
)}

                </span>
                <span className="result-snippet">{extractSnippet(result.matchedText, query)}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
