import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/home/home.css';

export default function Home() {
  const navigate = useNavigate();

  // Handler for scroll-to-products
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
            <h2>Welcome to E-STORE!</h2>
            <p>Your one-stop shop for the best products and deals.</p>
          </div>
          <h1>Big Sale! Up to 50% Off</h1>
          <p>Shop the latest deals and exclusive offers now.</p>
          <button className="shop-now-btn" onClick={handleScrollToProducts}>
            Shop Now
          </button>
        </div>
      </section>

      {/* Scroll Down Arrow */}
      <div className="scroll-down-arrow" onClick={handleScrollToProducts}>
        <span>&#8595;</span>
      </div>

      {/* Products Section (anchor for scroll) */}
      <section id="products-section" className="home-products-section">
        <h2>Featured Products</h2>
        <p>Browse our bestsellers and new arrivals below.</p>
        <button className="view-all-btn" onClick={() => navigate('/products')}>
          View All Products
        </button>
      </section>
    </div>
  );
}
