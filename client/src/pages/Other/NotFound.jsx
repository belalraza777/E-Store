import React from "react";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1 className="notfound-title">404</h1>
        <h2 className="notfound-subtitle">Page Not Found</h2>
        <p className="notfound-message">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <a href="/" className="notfound-home-btn">Go to Homepage</a>
      </div>
    </div>
  );
};

export default NotFound;
