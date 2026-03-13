import React, { useEffect, useState } from 'react';
import './Preloader.css';

const Preloader = () => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Initial entrance animation is handled by CSS
  }, []);

  return (
    <div className={`preloader-overlay ${fadeOut ? 'fade-out' : ''}`}>
      <div className="preloader-content">
        <div className="preloader-logo-box">
          <span className="preloader-icon">🍔</span>
          <div className="pulse-ring"></div>
          <div className="pulse-ring-outer"></div>
        </div>
        
        <div className="preloader-text-wrapper">
          <h1 className="preloader-brand">Cravely</h1>
          <div className="loading-bar-container">
            <div className="loading-bar-fill"></div>
          </div>
          <p className="preloader-status">Preparing your feast...</p>
        </div>
      </div>
      
      {/* Dynamic background elements */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
    </div>
  );
};

export default Preloader;
