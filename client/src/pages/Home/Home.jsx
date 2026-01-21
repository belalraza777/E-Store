import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaStar } from 'react-icons/fa';
import '../../styles/pages/home/home.css';

export default function Home() {
  const navigate = useNavigate();

  const handleScrollToProducts = () => {
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/products');
    }
  };

  return (
    <div className="home-page">
      {/* Top Ad Section */}
      <section className="home-ad-section">
        <div className="ad-content">
          {/* Welcome User Message */}
          <div className="welcome-user">
            <h2>Welcome to E-STORE! 👋</h2>
            <p>Discover amazing deals on premium products</p>
          </div>
          
          <div className="deal-highlight">
            <div className="sale-tag">
              <span>Offer</span>
            </div>
            <h1>Big Sale! Up to <span className="highlight">30% Off</span></h1>
            <p className="deal-subtitle">Shop exclusive deals before they're gone!</p>
            <div className="trust-badges">
              <span><FaStar /> 4.8/5 Rating</span>
              <span>✓ Happy Customers</span>
              <span>🚚 Free Shipping</span>
            </div>
          </div>
          
          <button className="shop-now-btn" onClick={handleScrollToProducts}>
            Explore Deals <FaArrowRight className="btn-icon" />
          </button>
        </div>
      </section>

      {/* Scroll Down Arrow */}
      <div className="scroll-down-arrow" onClick={handleScrollToProducts}>
        <span>&#8595;</span>
        <p>Scroll to explore</p>
      </div>

      {/* Products Section (anchor for scroll) */}
      <section id="products-section" className="home-products-section">
        <div className="section-header">
          <h2>🎯 Featured Collection</h2>
          <p>Curated selection of our best products</p>
        </div>
        <div className="features-grid">
          <div className="feature">
            <div className="feature-icon">💎</div>
            <h3>Premium Quality</h3>
            <p>Top-rated products only</p>
          </div>
          <div className="feature">
            <div className="feature-icon">💰</div>
            <h3>Best Prices</h3>
            <p>Price match guarantee</p>
          </div>
          <div className="feature">
            <div className="feature-icon">⚡</div>
            <h3>Fast Delivery</h3>
            <p>Safe shipping</p>
          </div>
        </div>
        <button className="view-all-btn" onClick={() => navigate('/products')}>
          Browse All Products <FaArrowRight />
        </button>
      </section>
    </div>
  );
}