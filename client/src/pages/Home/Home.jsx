import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaStar } from 'react-icons/fa';
import './Home.css';

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
      <section className="home-page__hero">
        <div className="home-page__hero-inner">
          {/* Welcome User Message */}
          <div>
            <h2 className="home-page__welcome-title">Welcome to E-STORE!</h2>
            <p className="home-page__welcome-subtitle">Discover amazing deals on premium products</p>
          </div>
          
          <div>
            <h1 className="home-page__deal-title">
              Big Sale! Up to <span className="home-page__deal-highlight">30% Off</span>
            </h1>
            <p className="home-page__deal-subtitle">Shop exclusive deals before they're gone!</p>
            <div className="home-page__badges">
              <span className="home-page__badge"><FaStar /> 4.8/5 Rating</span>
              <span className="home-page__badge">Happy Customers</span>
              <span className="home-page__badge">Free Shipping</span>
            </div>
          </div>
          
          <button className="home-page__cta" onClick={handleScrollToProducts}>
            Explore Deals <FaArrowRight aria-hidden="true" />
          </button>
        </div>
      </section>

      {/* Scroll Down Arrow */}
      <div className="home-page__scroll" onClick={handleScrollToProducts}>
        <div className="home-page__scroll-icon" aria-hidden="true">
          <span>&#8595;</span>
        </div>
        <p>Scroll to explore</p>
      </div>

      {/* Products Section (anchor for scroll) */}
      <section id="products-section" className="home-page__section">
        <div className="home-page__section-inner">
          <h2 className="home-page__section-title">Featured Collection</h2>
          <p className="home-page__section-subtitle">Curated selection of our best products</p>

          <div className="home-page__features">
            <div className="home-page__feature">
              <div className="home-page__feature-icon" aria-hidden="true">💎</div>
              <h3 className="home-page__feature-title">Premium Quality</h3>
              <p className="home-page__feature-text">Top-rated products only</p>
            </div>
            <div className="home-page__feature">
              <div className="home-page__feature-icon" aria-hidden="true">💰</div>
              <h3 className="home-page__feature-title">Best Prices</h3>
              <p className="home-page__feature-text">Price match guarantee</p>
            </div>
            <div className="home-page__feature">
              <div className="home-page__feature-icon" aria-hidden="true">⚡</div>
              <h3 className="home-page__feature-title">Fast Delivery</h3>
              <p className="home-page__feature-text">Safe shipping</p>
            </div>
          </div>

          <button className="home-page__secondary-cta" onClick={() => navigate('/products')}>
          Browse All Products <FaArrowRight />
          </button>
        </div>
      </section>
    </div>
  );
}