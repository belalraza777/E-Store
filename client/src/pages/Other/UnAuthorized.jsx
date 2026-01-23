
import React from "react";
import "./UnAuthorized.css";

const UnAuthorized = () => {
  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <h1 className="unauthorized-title">Unauthorized Access</h1>
        <p className="unauthorized-message">
          Sorry, you do not have permission to view this page.<br />
          If you believe this is a mistake, please contact support.
        </p>
        <a href="/" className="unauthorized-home-btn">Go to Homepage</a>
      </div>
    </div>
  );
};

export default UnAuthorized;
