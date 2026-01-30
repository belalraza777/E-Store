// Header.jsx - Main site header with navigation, search, and cart
import { use, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { FiMenu, FiX, FiShoppingCart, FiUser, FiLogOut, FiSearch } from "react-icons/fi";
import './Header.css'
import useCartStore from '../store/cartStore.js';
import logo from '../assets/estorelogo.png';
import SearchBar from "../pages/search/SearchBar.jsx";


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
    <header className="site-header">
      <div className="site-header__inner">
        {/* Logo */}
        <Link to="/" className="site-header__brand">
          <img src={logo} alt="E-Store" className="site-header__logo" />
          {/* <span className="site-header__brand-text">E-Store</span> */}
        </Link>

        {/* Search Bar */}
        <SearchBar />

        {/* Desktop Navigation */}
        <nav className="site-header__nav site-header__nav--desktop">
          <Link to="/" className="site-header__nav-link">Home</Link>
          <Link to="/products" className="site-header__nav-link">Products</Link>
          <Link to="/orders" className="site-header__nav-link">Orders</Link>
          <Link to="/contact" className="site-header__nav-link">Contact</Link>
        </nav>

        {/* Right Actions - Cart, Profile, Mobile Menu */}
        <div className="site-header__actions">
          {/* Cart button with item count badge */}
          <button className="site-header__action" onClick={() => navigate('/cart')} aria-label="Cart">
            <FiShoppingCart />
            <span className="site-header__cart-badge">{cartItemCount}</span>
          </button>

          {/* Show profile or login based on auth state */}
          {user ? (
            <Link to="/profile" className="site-header__action" aria-label="Profile">
              <FiUser />
              <span className="site-header__user-name">{user?.name}</span>
            </Link>
          ) : (
            <Link to="/login" className="site-header__action">Sign In</Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="site-header__menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - shown when toggle is clicked */}
      {mobileMenuOpen && (
        <nav className="site-header__mobile-menu">
          <Link to="/" className="site-header__mobile-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/products" className="site-header__mobile-link" onClick={() => setMobileMenuOpen(false)}>Products</Link>
          <Link to="/orders" className="site-header__mobile-link" onClick={() => setMobileMenuOpen(false)}>Orders</Link>
          <Link to="/contact" className="site-header__mobile-link" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
          {!user && (
            <Link to="/login" className="site-header__mobile-link" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
          )}
        </nav>
      )}
    </header>
  );
}
