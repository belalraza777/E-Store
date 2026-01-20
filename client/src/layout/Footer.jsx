import { Link } from "react-router-dom";
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
// Styles loaded via main.css

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About Section */}
        <div className="footer-section">
          <div className="footer-logo">
            <img src="https://png.pngtree.com/element_pic/00/16/09/2057e0eecf792fb.jpg" alt="E-Store" className="footer-logo-img" />
            <span className="footer-logo-text">E-Store</span>
          </div>
          <p className="footer-description">
            Your one-stop shop for quality products and exceptional service. Discover amazing deals and fast delivery.
          </p>
          <div className="social-links">
            <a href="#facebook" className="social-icon" aria-label="Facebook">
              <FiFacebook />
            </a>
            <a href="#twitter" className="social-icon" aria-label="Twitter">
              <FiTwitter />
            </a>
            <a href="#instagram" className="social-icon" aria-label="Instagram">
              <FiInstagram />
            </a>
            <a href="#linkedin" className="social-icon" aria-label="LinkedIn">
              <FiLinkedin />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/orders">Orders</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div className="footer-section">
          <h3 className="footer-title">Categories</h3>
          <ul className="footer-links">
            <li><a href="#electronics">Electronics</a></li>
            <li><a href="#fashion">Fashion</a></li>
            <li><a href="#home">Home & Garden</a></li>
            <li><a href="#sports">Sports & Outdoors</a></li>
            <li><a href="#books">Books & Media</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h3 className="footer-title">Contact Us</h3>
          <div className="contact-info">
            <div className="contact-item">
              <FiPhone className="contact-icon" />
              <a href="tel:+917004068598">+91 7004068598</a>
            </div>
            <div className="contact-item">
              <FiMail className="contact-icon" />
              <a href="mailto:support@estore.com">belal@estore.com</a>
            </div>
            <div className="contact-item">
              <FiMapPin className="contact-icon" />
              <span>123 Commerce St, Business City, BC 12345</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {currentYear} E-Store. All rights reserved.</p>
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <span className="divider">•</span>
            <Link to="/terms">Terms of Service</Link>
            <span className="divider">•</span>
            <Link to="/shipping">Shipping Info</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
