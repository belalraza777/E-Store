import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowRight,
  FaBolt,
  FaCheck,
  FaShieldAlt,
  FaShoppingBag,
  FaStar,
  FaTruck,
  FaUndoAlt,
} from 'react-icons/fa';
import useProductStore from '../../store/productStore.js';
import ProductList from '../../components/product/ProductList.jsx';
import './Home.css';

const valueProps = [
  {
    icon: <FaShieldAlt aria-hidden="true" />,
    title: 'Quality checked',
    text: 'Thoughtful products selected for everyday use.',
  },
  {
    icon: <FaTruck aria-hidden="true" />,
    title: 'Fast delivery',
    text: 'Simple, reliable shipping from checkout to doorstep.',
  },
  {
    icon: <FaUndoAlt aria-hidden="true" />,
    title: 'Easy returns',
    text: 'A straightforward experience if something is not right.',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { products, loading, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts({ page: 1 });
  }, [fetchProducts]);

  const featuredProduct = products[0];
  const featuredPrice = featuredProduct?.discountPrice ?? featuredProduct?.price;

  const handleScrollToProducts = () => {
    const productsSection = document.getElementById('products-section');

    if (productsSection) {
      productsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      return;
    }

    navigate('/products');
  };

  const goToProducts = () => navigate('/products');

  return (
    <div className="home-page">
      <aside className="home-page__demo-notice" role="note" aria-label="Demo site notice">
        <span className="home-page__demo-notice-icon" aria-hidden="true">
          <FaShieldAlt />
        </span>

        <div className="home-page__demo-notice-content">
          <strong>Demo website.</strong>
          <span>
            This website is a demo for review and is not taking any orders for now.
          </span>
        </div>
      </aside>

      <main>
        <section className="home-page__hero" aria-labelledby="home-page-title">
          <div className="home-page__hero-inner">
            <div className="home-page__hero-copy">
              <div className="home-page__eyebrow">
                <span className="home-page__eyebrow-dot" aria-hidden="true" />
                Curated essentials for modern living
              </div>

              <h1 id="home-page-title" className="home-page__hero-title">
                Good products.
                <span>Better prices.</span>
              </h1>

              <p className="home-page__hero-description">
                Discover practical, premium pieces designed to make everyday life
                feel a little more considered.
              </p>

              <div className="home-page__hero-actions">
                <button
                  className="home-page__button home-page__button--primary"
                  type="button"
                  onClick={handleScrollToProducts}
                >
                  Shop the collection
                  <FaArrowRight aria-hidden="true" />
                </button>

                <button
                  className="home-page__button home-page__button--secondary"
                  type="button"
                  onClick={goToProducts}
                >
                  View all products
                  <span aria-hidden="true">↗</span>
                </button>
              </div>

              <div className="home-page__metrics" role="list">
                <div className="home-page__metric" role="listitem">
                  <strong>4.8/5</strong>
                  <span>
                    <FaStar aria-hidden="true" />
                    customer rating
                  </span>
                </div>

                <div className="home-page__metric" role="listitem">
                  <strong>30%</strong>
                  <span>maximum savings</span>
                </div>

                <div className="home-page__metric" role="listitem">
                  <strong>24h</strong>
                  <span>dispatch promise</span>
                </div>
              </div>
            </div>

            <div className="home-page__showcase" aria-label="Featured product preview">
              <div className="home-page__showcase-grid" aria-hidden="true" />

              <div className="home-page__showcase-card">
                <div className="home-page__showcase-meta">
                  <span>e-store / 01</span>
                  <span>Featured drop</span>
                </div>

                <div className="home-page__showcase-art" aria-hidden="true">
                  <FaShoppingBag />
                </div>

                <div className="home-page__showcase-details">
                  <div>
                    <p>{featuredProduct?.category || 'Featured product'}</p>
                    <h2>
                      {featuredProduct?.title || 'Carry light. Live well.'}
                    </h2>
                  </div>

                  <strong>
                    {featuredPrice ? `₹${Number(featuredPrice).toFixed(2)}` : 'Explore'}
                  </strong>
                </div>

                <div className="home-page__showcase-footer">
                  <span>
                    <FaCheck aria-hidden="true" />
                    Quality checked
                  </span>
                  <span>Free shipping</span>
                </div>
              </div>

              <div className="home-page__floating-card home-page__floating-card--rating">
                <FaStar aria-hidden="true" />
                <strong>4.8</strong>
                <span>from happy shoppers</span>
              </div>

              <div className="home-page__floating-card home-page__floating-card--delivery">
                <FaBolt aria-hidden="true" />
                <span>Fast delivery</span>
              </div>
            </div>
          </div>

          <button
            className="home-page__scroll-hint"
            type="button"
            onClick={handleScrollToProducts}
          >
            <span className="home-page__scroll-hint-icon" aria-hidden="true">
              <FaArrowRight />
            </span>
            Explore the collection
          </button>
        </section>

        <section className="home-page__trust-strip" aria-label="Store benefits">
          <div className="home-page__trust-intro">
            <span>Built around</span>
            <strong>simple, better shopping.</strong>
          </div>

          <div className="home-page__trust-item">
            <FaShieldAlt aria-hidden="true" />
            <span>Secure experience</span>
          </div>

          <div className="home-page__trust-item">
            <FaTruck aria-hidden="true" />
            <span>Reliable delivery</span>
          </div>

          <div className="home-page__trust-item">
            <FaUndoAlt aria-hidden="true" />
            <span>Easy returns</span>
          </div>
        </section>

        <section
          id="products-section"
          className="home-page__collection"
          aria-labelledby="collection-title"
        >
          <div className="home-page__section-heading">
            <div>
              <p className="home-page__eyebrow">Featured products</p>
              <h2 id="collection-title">
                Find your next
                <span>everyday favorite.</span>
              </h2>
            </div>

            <button
              className="home-page__inline-link"
              type="button"
              onClick={goToProducts}
            >
              Browse everything
              <FaArrowRight aria-hidden="true" />
            </button>
          </div>

          <ProductList products={products.slice(0, 4)} loading={loading && products.length === 0} />
        </section>

        <section className="home-page__values" aria-labelledby="values-title">
          <div className="home-page__section-heading home-page__section-heading--centered">
            <div>
              <p className="home-page__eyebrow">Why e-store</p>
              <h2 id="values-title">
                Designed to feel
                <span>effortless.</span>
              </h2>
            </div>

            <p>
              From the first scroll to the final purchase, every detail is made to
              stay clear, useful, and enjoyable.
            </p>
          </div>

          <div className="home-page__value-grid">
            {valueProps.map((value) => (
              <article className="home-page__value-card" key={value.title}>
                <div className="home-page__value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="home-page__closing">
          <div>
            <p className="home-page__eyebrow">Ready when you are</p>
            <h2>
              Find something worth
              <span>bringing home.</span>
            </h2>
          </div>

          <button
            className="home-page__button home-page__button--light"
            type="button"
            onClick={goToProducts}
          >
            Browse all products
            <FaArrowRight aria-hidden="true" />
          </button>
        </section>
      </main>
    </div>
  );
}
