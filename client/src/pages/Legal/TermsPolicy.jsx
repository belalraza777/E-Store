import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './TermsPolicy.css';

export default function TermsPolicy() {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash?.slice(1);
    if (hash) {
      const el = document.getElementById(hash);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="terms-policy">
      <div className="terms-policy__inner">
        <header className="terms-policy__header">
          <h1 className="terms-policy__title">Terms, Conditions & Privacy Policy</h1>
          <p className="terms-policy__intro">
            Please read these documents carefully before using E-Store. By using our site, you agree to these terms and our privacy practices.
          </p>
          <nav className="terms-policy__nav" aria-label="Page sections">
            <Link to="/terms-and-policy#terms" className="terms-policy__nav-link">
              Terms & Conditions
            </Link>
            <Link to="/terms-and-policy#privacy" className="terms-policy__nav-link">
              Privacy Policy
            </Link>
          </nav>
        </header>

        <section id="terms" className="terms-policy__section">
          <h2 className="terms-policy__section-title">Terms & Conditions</h2>
          <p className="terms-policy__updated">Last updated: January 2025</p>

          <h3 className="terms-policy__heading">1. Acceptance of Terms</h3>
          <p>
            By accessing or using E-Store (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), you agree to be bound by these Terms and Conditions. 
            If you do not agree, please do not use our website or services.
          </p>

          <h3 className="terms-policy__heading">2. Use of the Service</h3>
          <p>
            You may use E-Store only for lawful purposes. You agree not to misuse the platform, attempt to gain unauthorized access 
            to any systems or data, or use the service in any way that could harm, disable, or overburden our infrastructure.
          </p>

          <h3 className="terms-policy__heading">3. Account & Registration</h3>
          <p>
            To place orders or access certain features, you may need to create an account. You are responsible for keeping your 
            credentials secure and for all activity under your account. Provide accurate and complete information when registering.
          </p>

          <h3 className="terms-policy__heading">4. Orders & Payment</h3>
          <p>
            All orders are subject to availability and confirmation of the order price. We reserve the right to refuse or cancel 
            any order. Prices and availability are subject to change without notice. Payment must be received before order processing.
          </p>

          <h3 className="terms-policy__heading">5. Shipping & Delivery</h3>
          <p>
            Delivery times are estimates and not guaranteed. We are not liable for delays caused by carriers or circumstances 
            beyond our control. Risk of loss passes to you upon delivery to the carrier.
          </p>

          <h3 className="terms-policy__heading">6. Returns & Refunds</h3>
          <p>
            Our return and refund policy is detailed on the product and checkout pages. Please review it before purchasing. 
            Eligible items may be returned within the specified period in their original condition.
          </p>

          <h3 className="terms-policy__heading">7. Intellectual Property</h3>
          <p>
            All content on E-Store—including text, graphics, logos, images, and software—is our property or our licensors&apos; 
            and is protected by copyright and other intellectual property laws. You may not reproduce or use it without our written consent.
          </p>

          <h3 className="terms-policy__heading">8. Limitation of Liability</h3>
          <p>
            To the fullest extent permitted by law, E-Store shall not be liable for any indirect, incidental, special, or 
            consequential damages arising from your use of the service. Our total liability shall not exceed the amount you paid 
            for the relevant order.
          </p>

          <h3 className="terms-policy__heading">9. Changes</h3>
          <p>
            We may update these Terms from time to time. Continued use of the site after changes constitutes acceptance. 
            We encourage you to review this page periodically.
          </p>

          <h3 className="terms-policy__heading">10. Contact</h3>
          <p>
            For questions about these Terms, contact us at{' '}
            <a href="mailto:support@estore.com" className="terms-policy__link">support@estore.com</a> or via the contact details 
            in our footer.
          </p>
        </section>

        <section id="privacy" className="terms-policy__section">
          <h2 className="terms-policy__section-title">Privacy Policy</h2>
          <p className="terms-policy__updated">Last updated: January 2025</p>

          <h3 className="terms-policy__heading">1. Information We Collect</h3>
          <p>
            We collect information you provide directly (name, email, address, payment details when you register, order, or 
            contact us) and automatically (IP address, device type, browser, pages visited) when you use our website.
          </p>

          <h3 className="terms-policy__heading">2. How We Use Your Information</h3>
          <p>
            We use your information to process orders, communicate with you, improve our services, prevent fraud, and comply 
            with legal obligations. We may send you transactional emails and, with your consent, marketing communications.
          </p>

          <h3 className="terms-policy__heading">3. Sharing of Information</h3>
          <p>
            We do not sell your personal data. We may share it with service providers (e.g. payment processors, shipping 
            carriers) who assist our operations, and when required by law or to protect our rights and safety.
          </p>

          <h3 className="terms-policy__heading">4. Data Security</h3>
          <p>
            We implement appropriate technical and organizational measures to protect your data. However, no method of 
            transmission over the internet is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h3 className="terms-policy__heading">5. Your Rights</h3>
          <p>
            Depending on your location, you may have the right to access, correct, delete, or restrict processing of your 
            personal data. Contact us to exercise these rights. You may also opt out of marketing communications at any time.
          </p>

          <h3 className="terms-policy__heading">6. Cookies & Tracking</h3>
          <p>
            We use cookies and similar technologies to maintain sessions, analyze traffic, and improve user experience. 
            You can adjust your browser settings to limit or disable cookies, though some features may not work fully.
          </p>

          <h3 className="terms-policy__heading">7. Retention</h3>
          <p>
            We retain your data only as long as necessary to fulfill the purposes described in this policy or as required 
            by law (e.g. tax, fraud prevention).
          </p>

          <h3 className="terms-policy__heading">8. Updates</h3>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new 
            version on this page and updating the &quot;Last updated&quot; date.
          </p>

          <h3 className="terms-policy__heading">9. Contact</h3>
          <p>
            For privacy-related questions or requests, email us at{' '}
            <a href="mailto:privacy@estore.com" className="terms-policy__link">privacy@estore.com</a> or use the contact 
            information in the footer.
          </p>
        </section>

        <footer className="terms-policy__footer">
          <Link to="/" className="terms-policy__back">← Back to Home</Link>
        </footer>
      </div>
    </div>
  );
}
