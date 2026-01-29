// OrderStatusUpdateForm.jsx
// Admin form to update order and payment status
import React from 'react';
import { FiSettings, FiCheckCircle } from 'react-icons/fi';

export default function OrderStatusUpdateForm({
  form,
  loading,
  submitting,
  onChange,
  onSubmit,
}) {
  return (
    <section className="admin-order-detail-page__card admin-order-detail-page__card--full-width">
      <div className="admin-order-detail-page__card-header">
        <h2><FiSettings /> Update Status</h2>
      </div>

      <div className="admin-order-detail-page__card-body">
        <form
          onSubmit={onSubmit}
          className="admin-order-detail-page__status-update-form"
        >
          <div className="admin-order-detail-page__update-grid">
            {/* Order Status */}
            <div className="admin-order-detail-page__update-box">
              <label className="admin-order-detail-page__form-label">
                Order Status
              </label>
              <select
                name="orderStatus"
                value={form.orderStatus}
                onChange={onChange}
                required
                className="admin-order-detail-page__form-select"
              >
                <option value="">Select status</option>
                <option value="placed">Placed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Payment Status */}
            <div className="admin-order-detail-page__update-box">
              <label className="admin-order-detail-page__form-label">
                Payment Status
              </label>
              <select
                name="paymentStatus"
                value={form.paymentStatus}
                onChange={onChange}
                className="admin-order-detail-page__form-select"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || loading}
            className="admin-order-detail-page__submit-btn"
          >
            {submitting ? 'Updating...' : <><FiCheckCircle /> Update Status</>}
          </button>
        </form>
      </div>
    </section>
  );
}
