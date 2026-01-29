// OrderTotals.jsx
// Shows subtotal, discount and final payable amount
import React from 'react';
import { FiDollarSign } from 'react-icons/fi';

export default function OrderTotals({ subtotal, discount, total }) {
  return (
    <section className="admin-order-detail-page__card admin-order-detail-page__card--full-width">
      <div className="admin-order-detail-page__card-header">
        <h2><FiDollarSign /> Order Totals</h2>
      </div>

      <div className="admin-order-detail-page__card-body">
        <div className="admin-order-detail-page__totals-box">
          {/* Subtotal */}
          <div className="admin-order-detail-page__total-row">
            <span className="admin-order-detail-page__total-label">Subtotal</span>
            <span className="admin-order-detail-page__total-amount">
              ₹{subtotal.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Discount */}
          <div className="admin-order-detail-page__total-row">
            <span className="admin-order-detail-page__total-label">Discount</span>
            <span className="admin-order-detail-page__total-amount admin-order-detail-page__total-amount--discount">
              -₹{discount.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Grand Total */}
          <div className="admin-order-detail-page__total-row admin-order-detail-page__total-row--grand-total">
            <span className="admin-order-detail-page__total-label">Total Amount</span>
            <span className="admin-order-detail-page__total-amount">
              ₹{total.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
