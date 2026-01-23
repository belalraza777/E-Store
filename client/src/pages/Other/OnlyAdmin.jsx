
import React from "react";
import "./OnlyAdmin.css";

const OnlyAdmin = () => {
	return (
		<div className="onlyadmin-container">
			<div className="onlyadmin-content">
				<h1 className="onlyadmin-title">Admin Access Only</h1>
				<p className="onlyadmin-message">
					Sorry, this page is restricted to administrators.<br />
					If you believe this is a mistake, please contact support.
				</p>
				<a href="/" className="onlyadmin-home-btn">Go to Homepage</a>
			</div>
		</div>
	);
};

export default OnlyAdmin;
