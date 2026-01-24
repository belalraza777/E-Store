import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found__inner">
        <span className="not-found__code" aria-hidden="true">404</span>
        <h1 className="not-found__title">Page not found</h1>
        <p className="not-found__text">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <nav className="not-found__nav" aria-label="Navigation">
          <Link to="/" className="not-found__link not-found__link--primary">
            Back to Home
          </Link>
          <Link to="/products" className="not-found__link">
            Browse Products
          </Link>
        </nav>
      </div>
    </div>
  );
}