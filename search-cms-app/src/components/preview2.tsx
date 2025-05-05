import React, { useState } from 'react';

const Preview2 = ({ searchType }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <div className="prev-container">
      <div className="preview-cardd">
        {searchType === "Expand" ? (
          <div className="expanded-search-bar">
            <div className="search-barr">
              <input
                type="text"
                className="search-input"
                placeholder="Search..."
              />
              <button className="search-button">
                <img src="/images/searchh.png" alt="Search" className="search-icon" />
              </button>
            </div>
          </div>
        ) : (
          <div className="icon-search-bar">
            {!isExpanded && (
              <button className="search-icon-btn" onClick={() => setIsExpanded(true)}>
                <img src="/images/search-normal.png" alt="Search Icon" />
              </button>
            )}
            {isExpanded && (
              <div className="search-barr">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search..."
                />
                <button className="search-button">
                  <img src="/images/searchh.png" alt="Search" className="search-icon" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      </div> 
    </div>
  );
};

export default Preview2;
