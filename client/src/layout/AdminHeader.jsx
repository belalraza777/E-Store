// AdminHeader.jsx - Admin panel header with navigation menu
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
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
// Styles loaded via main.css

export default function AdminHeader() {
  // State for mobile menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Get user and logout from auth context
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  // Handle logout and redirect to login
  const handleLogoutClick = async () => {
    await handleLogout();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  // Admin navigation menu items
  const adminMenus = [
    { label: "Dashboard", icon: FiBarChart2, href: "/admin/dashboard" },
    { label: "Products", icon: FiShoppingBag, href: "/admin/products" },
    { label: "Orders", icon: FiPackage, href: "/admin/orders" },
    { label: "Reviews", icon: FiStar, href: "/admin/reviews" },
  ];

  return (
    <header className="admin-header">
      <div className="admin-header-container">
        {/* Logo & Brand */}
        <Link to="/admin/dashboard" className="admin-logo">
          <FiBarChart2 size={28} />
          <span>Admin Panel</span>
        </Link>

        {/* Desktop Navigation - loop through menu items */}
        <nav className="admin-nav">
          {adminMenus.map((menu) => {
            const Icon = menu.icon;
            return (
              <Link 
                key={menu.href} 
                to={menu.href} 
                className="admin-nav-link"
              >
                <Icon size={18} />
                <span>{menu.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="admin-header-right">
          {/* Show admin name */}
          <div className="user-info">
            <FiUsers size={20} />
            <span>{user?.name || "Admin"}</span>
          </div>
          {/* Logout button */}
          <button 
            className="logout-btn" 
            onClick={handleLogoutClick}
            title="Logout"
          >
            <FiLogOut size={20} />
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation - shown when toggle clicked */}
      {mobileMenuOpen && (
        <nav className="admin-mobile-nav">
          {adminMenus.map((menu) => {
            const Icon = menu.icon;
            return (
              <Link 
                key={menu.href}
                to={menu.href}
                className="admin-mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon size={18} />
                <span>{menu.label}</span>
              </Link>
            );
          })}
          <button 
            className="admin-mobile-logout"
            onClick={handleLogoutClick}
          >
            <FiLogOut size={18} />
            <span>Logout</span>
          </button>
        </nav>
      )}
    </header>
  );
}
