// Creating a functional component using "rafc -> Enter"
import React from 'react';
import './Header.css';

export const Header = () => {
  return (
    <div className="header-container">
      <div className="top-section">
        {/* <img src={logoImage} alt="Logo" className="logo-image" /> */}
        <p className="logo-message">Money In --{`>`} Money Out</p>
      </div>
      <div className="image-section">
        <h1>TRACK YOUR TRANSACTIONS NOW! </h1>
      </div>
    </div>
  );
};
