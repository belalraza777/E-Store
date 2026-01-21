// Header.jsx - Main site header with navigation, search, and cart
import { use, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { FiMenu, FiX, FiShoppingCart, FiUser, FiLogOut, FiSearch } from "react-icons/fi";
// Styles loaded via main.css
import useCartStore from '../store/cartStore.js'


export default function Header() {
  // State for mobile menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Get user and logout function from auth context
  const { user, handleLogout } = useAuth();
  // Get cart data from store
  const { cart, fetchCart } = useCartStore();
  const navigate = useNavigate();
  // Track cart item count for badge
  const [cartItemCount, setCartItemCount] = useState(0);

  // Fetch cart on component mount
  useEffect(() => {
    fetchCart();
  }, []);
  
  // Update cart badge when cart changes
  useEffect(() => {
    if (cart && cart.items) {
      setCartItemCount(cart.items.length || 0);
    };
  }, [cart]);

  // Handle logout and redirect to login
  const handleLogoutClick = async () => {
    await handleLogout();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <img src="https://png.pngtree.com/element_pic/00/16/09/2057e0eecf792fb.jpg" alt="E-Store" className="logo-img" />
          <span className="logo-text">E-Store</span>
        </Link>

        {/* Search Bar */}
        <div className="header-search">
          <input type="text" placeholder="Search products..." className="search-input" />
          <button className="search-btn">
            <FiSearch />
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="header-nav desktop-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
          <Link to="/orders" className="nav-link">Orders</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </nav>

        {/* Right Actions - Cart, Profile, Mobile Menu */}
        <div className="header-actions">
          {/* Cart button with item count badge */}
          <button className="action-btn cart-btn" onClick={() => navigate('/cart')} >
            <FiShoppingCart />
            <span className="cart-badge">{cartItemCount}</span>
          </button>

          {/* Show profile or login based on auth state */}
          {user ? (
            <Link to="/profile" className="action-btn user-btn profile-btn-with-name">
              <FiUser />
              <span className="user-name">{user?.name}</span>
            </Link>
          ) : (
            <Link to="/login" className="action-btn login-btn">Sign In</Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - shown when toggle is clicked */}
      {mobileMenuOpen && (
        <nav className="mobile-menu">
          <Link to="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/products" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Products</Link>
          <Link to="/orders" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Orders</Link>
          <Link to="/contact" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
          {!user && (
            <Link to="/login" className="mobile-nav-link login-link" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
          )}
        </nav>
      )}
    </header>
  );
}
