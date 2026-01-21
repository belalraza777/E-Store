// AdminHeader.jsx - Admin panel header with navigation menu
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiBarChart2,
  FiShoppingBag,
  FiPackage,
  FiStar,
  FiUsers,
  FiLogOut,
  FiChevronDown
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext.jsx";
import Logout from "../components/FunctionalBtn/Logout.jsx";

import './AdminHeader.css'

export default function AdminHeader() {
  // State for mobile menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Get user and logout from auth context
  const { user } = useAuth();

  // Admin navigation menu items
  const adminMenus = [
    { label: "Dashboard", icon: FiBarChart2, href: "/admin/dashboard" },
    { label: "Products", icon: FiShoppingBag, href: "/admin/products" },
    { label: "Orders", icon: FiPackage, href: "/admin/orders" },
  ];

  return (
    <header className="admin-header">
      <div className="admin-header__inner">
        {/* Logo & Brand */}
        <Link to="/admin/dashboard" className="admin-header__brand">
          <FiBarChart2 size={28} />
          <span>Admin Panel</span>
        </Link>

        {/* Desktop Navigation - loop through menu items */}
        <nav className="admin-header__nav">
          {adminMenus.map((menu) => {
            const Icon = menu.icon;
            return (
              <Link
                key={menu.href}
                to={menu.href}
                className="admin-header__nav-link"
              >
                <Icon size={18} />
                <span>{menu.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="admin-header__right">
          {/* Show admin name */}
          <div className="admin-header__user">
            <FiUsers size={20} />
            <span>{user?.name || "Admin"}</span>
          </div>

          {/* Styled Logout button as component */}
          <Logout className="admin-logout-btn" />

          {/* Mobile Menu Toggle */}
          <button
            className="admin-header__menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle admin menu"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation - shown when toggle clicked */}
      {mobileMenuOpen && (
        <nav className="admin-header__mobile">
          {adminMenus.map((menu) => {
            const Icon = menu.icon;
            return (
              <Link
                key={menu.href}
                to={menu.href}
                className="admin-header__mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon size={18} />
                <span>{menu.label}</span>
              </Link>
            );
          })}
          <Logout
            className="admin-mobile-logout"
            onClick={() => setMobileMenuOpen(false)}
          />
        </nav>
      )}
    </header>
  );
}
