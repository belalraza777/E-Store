// Footer.jsx - Site footer with links, contact info, and social media
import { Link } from "react-router-dom";
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import './Footer.css'

export default function Footer() {
  // Get current year for copyright
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        {/* About Section - Logo and description */}
        <div className="site-footer__section">
          <div className="site-footer__brand">
            <img src="https://png.pngtree.com/element_pic/00/16/09/2057e0eecf792fb.jpg" alt="E-Store" className="site-footer__logo" />
            <span className="site-footer__brand-text">E-Store</span>
          </div>
          <p className="site-footer__description">
            Your one-stop shop for quality products and exceptional service. Discover amazing deals and fast delivery.
          </p>
          {/* Social media links */}
          <div className="site-footer__social">
            <a href="#facebook" className="site-footer__social-link" aria-label="Facebook">
              <FiFacebook />
            </a>
            <a href="#twitter" className="site-footer__social-link" aria-label="Twitter">
              <FiTwitter />
            </a>
            <a href="#instagram" className="site-footer__social-link" aria-label="Instagram">
              <FiInstagram />
            </a>
            <a href="#linkedin" className="site-footer__social-link" aria-label="LinkedIn">
              <FiLinkedin />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="site-footer__section">
          <h3 className="site-footer__title">Quick Links</h3>
          <ul className="site-footer__links">
            <li><Link to="/feedback">Feedback</Link></li>
            <li><Link to="/terms-and-policy">Terms & Privacy</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/faq">FAQ</Link></li>

          </ul>
        </div>

        {/* Categories */}
        <div className="site-footer__section">
          <h3 className="site-footer__title">Categories</h3>
          <ul className="site-footer__links">
            <li><a href="#electronics">Electronics</a></li>
            <li><a href="#fashion">Fashion</a></li>
            <li><a href="#home">Home & Garden</a></li>
            <li><a href="#sports">Sports & Outdoors</a></li>
            <li><a href="#books">Books & Media</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="site-footer__section">
          <h3 className="site-footer__title">Contact Us</h3>
          <div className="site-footer__contact">
            <div className="site-footer__contact-item">
              <FiPhone aria-hidden="true" />
              <a href="tel:+917004068598">+91 7004068598</a>
            </div>
            <div className="site-footer__contact-item">
              <FiMail aria-hidden="true" />
              <a href="mailto:support@estore.com">support@estore.com</a>
            </div>
            <div className="site-footer__contact-item">
              <FiMapPin aria-hidden="true" />
              <span>Jhilli Chowk Akabrpur Mathurapur Samastipur Bihar 848101 India</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="site-footer__bottom">
        <div className="site-footer__bottom-inner">
          <p>&copy; {currentYear} E-Store. All rights reserved.</p>
          <div className="site-footer__legal">
            <Link to="/terms-and-policy#terms">Terms of Service</Link>
            <span className="site-footer__divider">•</span>
            <Link to="/terms-and-policy#privacy">Privacy Policy</Link>
            <span className="site-footer__divider">•</span>
            <Link to="/shipping">Shipping Info</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
