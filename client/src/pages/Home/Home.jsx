import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowRight,
  FaCheckCircle,
  FaInfoCircle,
  FaListAlt,
  FaShoppingBag,
  FaShieldAlt,
} from 'react-icons/fa';
import useProductStore from '../../store/productStore.js';
import ProductList from '../../components/product/ProductList.jsx';
import './Home.css';

const features = [
  {
    icon: FaShoppingBag,
    title: 'Easy browsing',
    text: 'Explore everyday products in one simple place.',
  },
  {
    icon: FaListAlt,
    title: 'Clear details',
    text: 'Find the information you need to make better choices.',
  },
  {
    icon: FaCheckCircle,
    title: 'Simple experience',
    text: 'A clean storefront designed to keep shopping effortless.',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { products, loading, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts({ page: 1 });
  }, [fetchProducts]);

  const goToProducts = () => navigate('/products');

  const scrollToProducts = () => {
    document.getElementById('products-section')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <div className="home-page">
      <aside className="home-notice" role="note">
        <FaInfoCircle aria-hidden="true" />
        <p>
          <strong>Demo storefront:</strong> Browse products freely.
          Online ordering is currently disabled.
        </p>
      </aside>

      <main>
        {/* Hero */}
        <section className="home-hero">
          <div className="home-hero__content">
            <div className="home-eyebrow">
              <span className="home-eyebrow__dot" />
              EVERYDAY SHOPPING, SIMPLIFIED
            </div>

            <h1>
              Find your
              <span> everyday essentials.</span>
            </h1>

            <p className="home-hero__description">
              Discover products for your everyday needs with a
              clean, simple, and enjoyable browsing experience.
            </p>

            <div className="home-hero__actions">
              <button
                type="button"
                className="home-button home-button--primary"
                onClick={scrollToProducts}
              >
                Explore products <FaArrowRight />
              </button>

              <button
                type="button"
                className="home-button home-button--secondary"
                onClick={goToProducts}
              >
                View collection
              </button>
            </div>

            <div className="home-hero__note">
              <FaShieldAlt aria-hidden="true" />
              <span>Simple browsing. Clear product information.</span>
            </div>
          </div>

          <div className="home-hero__visual" aria-hidden="true">
            <div className="home-hero__circle home-hero__circle--one" />
            <div className="home-hero__circle home-hero__circle--two" />

            <div className="home-hero__bag">
              <FaShoppingBag />
            </div>

            <span className="home-hero__brand">EAZY STORE<span>.</span></span>

            <div className="home-float home-float--top">
              <span className="home-float__icon">
                <FaCheckCircle />
              </span>
              <div>
                <strong>Made simple</strong>
                <small>Easy to explore</small>
              </div>
            </div>

            <div className="home-float home-float--bottom">
              <FaShoppingBag />
              <span>Your everyday finds</span>
            </div>
          </div>
        </section>

        {/* Store highlights */}
        <section className="home-highlights" aria-label="Store highlights">
          <div className="home-highlights__intro">
            <span>Discover more.</span>
            <strong>Shop smarter.</strong>
          </div>

          <div className="home-highlights__item">
            <FaShoppingBag />
            <span>Useful products</span>
          </div>

          <div className="home-highlights__item">
            <FaListAlt />
            <span>Product details</span>
          </div>

          <div className="home-highlights__item">
            <FaCheckCircle />
            <span>Simple experience</span>
          </div>
        </section>

        {/* Products */}
        <section
          id="products-section"
          className="home-collection"
          aria-labelledby="home-products-title"
        >
          <div className="home-section-heading">
            <div>
              <p className="home-eyebrow">EXPLORE THE STORE</p>
              <h2 id="home-products-title">
                Find something <span>you need.</span>
              </h2>
              <p className="home-section-description">
                Take a look at some products from our collection.
              </p>
            </div>

            <button
              type="button"
              className="home-text-link"
              onClick={goToProducts}
            >
              View all products <FaArrowRight />
            </button>
          </div>

          <ProductList
            products={products.slice(0, 4)}
            loading={loading && products.length === 0}
          />
        </section>

        {/* Benefits */}
        <section className="home-features">
          <div className="home-section-heading home-section-heading--features">
            <div>
              <p className="home-eyebrow">WHY EAZY STORE</p>
              <h2>
                Shopping without <span>the noise.</span>
              </h2>
            </div>

            <p className="home-section-description">
              Less clutter, useful information, and a straightforward
              way to explore the collection.
            </p>
          </div>

          <div className="home-features__grid">
            {features.map(({ icon: Icon, title, text }) => (
              <article className="home-feature-card" key={title}>
                <div className="home-feature-card__icon">
                  <Icon aria-hidden="true" />
                </div>

                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Closing section */}
        <section className="home-cta">
          <div>
            <p className="home-eyebrow">YOUR NEXT FIND AWAITS</p>
            <h2>Take a look around.</h2>
            <p>
              Explore the collection and discover what works for you.
            </p>
          </div>

          <button
            type="button"
            className="home-button home-button--light"
            onClick={goToProducts}
          >
            Browse products <FaArrowRight />
          </button>
        </section>
      </main>
    </div>
  );
}