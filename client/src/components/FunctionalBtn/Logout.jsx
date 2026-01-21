import React from 'react';
import { FiLogOut } from "react-icons/fi";
import { useAuth } from '../../context/AuthContext.jsx';
import './Logout.css';

/**
 * Logout button component for reuse in admin/user panels.
 * @param {object} props
 * @param {string} [props.className] - Additional class names for styling
 * @param {function} [props.onClick] - Optional onClick handler (runs before logout)
 */
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
