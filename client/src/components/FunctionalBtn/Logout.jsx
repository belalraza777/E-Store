import React from 'react';
import { FiLogOut } from "react-icons/fi";
import { useAuth } from '../../context/authContext.jsx';
import './Logout.css';

// Functional logout button component
// Accepts optional className and onClick props
export default function Logout({ className = '', onClick }) {
    const { handleLogout } = useAuth();

    async function onLogout(e) {
        if (onClick) onClick(e);
        try {
            await handleLogout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

    return (
        <button className={`logout-btn ${className}`.trim()} onClick={onLogout}>
            <FiLogOut size={18} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Logout
        </button>
    );
}
