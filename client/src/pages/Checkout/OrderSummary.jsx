// OrderSummary.jsx - Sidebar showing order items and totals
import React from 'react';
import { FiLock } from 'react-icons/fi';

export default function OrderSummary({ cart, originalTotal, discountedTotal, discountAmount }) {
  return (
    <div className="checkout-page__summary">
      <h2>Order Summary</h2>

      {/* List of cart items */}
      <div className="checkout-page__items">
        {cart?.items?.map(item => {
          const imageUrl = item.product?.images?.[0]?.url || item.product?.images?.[0];
          return (
            <div key={item._id} className="checkout-page__item">
              <div className="checkout-page__item-image">
                {imageUrl ? <img src={imageUrl} alt={item.product?.title} /> : <div className="placeholder">N/A</div>}
              </div>
              <div className="checkout-page__item-info">
                <p className="checkout-page__item-name">{item.product?.title}</p>
                <p className="checkout-page__item-qty">{item.quantity} ×</p>
              </div>
              <div className="checkout-page__item-price">₹{(item.discountPrice || item.price || 0).toLocaleString('en-IN')}</div>
            </div>
          );
        })}
      </div>

      {/* Price breakdown */}
      <div className="checkout-page__totals">
        <div className="checkout-page__row">
          <span>Subtotal</span>
          <span>₹{originalTotal.toLocaleString('en-IN')}</span>
        </div>
        {discountAmount > 0 && (
          <div className="checkout-page__row checkout-page__row--discount">
            <span>Discount</span>
            <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
          </div>
        )}
        <div className="checkout-page__row">
          <span>Shipping</span>
          <span style={{ color: 'var(--success)' }}>FREE</span>
        </div>
        <div className="checkout-page__row checkout-page__row--total">
          <span>Total</span>
          <span>₹{discountedTotal.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Secure Checkout Badge */}
      <div className="checkout-page__secure">
        <FiLock /> Secure checkout
      </div>
    </div>
  );
}
