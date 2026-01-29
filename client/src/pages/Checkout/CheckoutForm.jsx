// CheckoutForm.jsx - Handles shipping address and payment method in one form
import React from 'react';

export default function CheckoutForm({ form, handleChange, handleSubmit, submitting }) {
  return (
    <form className="checkout-page__form-section" onSubmit={handleSubmit}>
      {/* Shipping Address Section */}
      <h3 className="checkout-page__section-title">📍 Shipping Address</h3>
      <div className="checkout-page__section-content">
        <div className="checkout-page__shipping-form">
          {/* Name and Phone row */}
          <div className="checkout-page__form-row">
            <div className="checkout-page__form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </div>
            <div className="checkout-page__form-group">
              <label>Phone *</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone number"
                required
              />
            </div>
          </div>

          {/* Address textarea */}
          <div className="checkout-page__form-group checkout-page__form-group--full-width">
            <label>Address *</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Street address"
              rows={2}
              required
            />
          </div>

          {/* City and Postal Code row */}
          <div className="checkout-page__form-row">
            <div className="checkout-page__form-group">
              <label>City *</label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
                required
              />
            </div>
            <div className="checkout-page__form-group">
              <label>Postal Code *</label>
              <input
                type="text"
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                placeholder="PIN Code"
                required
              />
            </div>
          </div>

          {/* Country dropdown */}
          <div className="checkout-page__form-group">
            <label>Country</label>
            <select name="country" value={form.country} onChange={handleChange}>
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
            </select>
          </div>
        </div>
      </div>


      {/* Payment Method Section */}
      <h3 className="checkout-page__section-title">💳 Payment Method</h3>
      <div className="checkout-page__section-content">
        <div className="checkout-page__payment-methods">
          <label className={`checkout-page__payment-option ${form.paymentMethod === 'COD' ? 'checkout-page__payment-option--selected' : ''}`}>
            <input
              type="radio"
              name="paymentMethod"
              value="COD"
              checked={form.paymentMethod === 'COD'}
              onChange={handleChange}
            />
            <span className="checkout-page__payment-name">Cash on Delivery</span>
          </label>

          <label className={`checkout-page__payment-option ${form.paymentMethod === 'Online' ? 'checkout-page__payment-option--selected' : ''}`}>
            <input
              type="radio"
              name="paymentMethod"
              value="Online"
              checked={form.paymentMethod === 'Online'}
              onChange={handleChange}
            />
            <span className="checkout-page__payment-name">Pay Online</span>
          </label>
        </div>
        {form.paymentMethod === 'Online' && (
          <div className="checkout-page__terms" style={{ fontSize: '0.92em', color: '#b91c1c', marginTop: 8 }}>
            * If you pay online, your order is <b>not cancellable</b> as for now.
          </div>
        )}
      </div>

      {/* Place Order Button */}
      <button type="submit" className="checkout-page__place-order-btn" disabled={submitting}>
        {submitting ? 'Placing Order...' : 'Place Order'}
      </button>
    </form>
  );
}
