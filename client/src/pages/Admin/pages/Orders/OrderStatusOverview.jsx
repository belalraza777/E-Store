// OrderStatusOverview.jsx
// Displays order, payment status and total summary cards
import React from 'react';
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiCreditCard,
  FiBarChart2,
  FiInfo
} from 'react-icons/fi';

// Resolve icon based on status value
const getStatusIcon = (status) => ({
  placed: <FiPackage />,
  shipped: <FiTruck />,
  delivered: <FiCheckCircle />,
  cancelled: <FiXCircle />,
  pending: <FiClock />,
  paid: <FiCreditCard />,
  failed: <FiXCircle />,
}[status] || <FiInfo />);

export default function OrderStatusOverview({ order }) {
  return (
    <div className="admin-order-detail-page__status-overview">
      {/* Order Status */}
      <div className="admin-order-detail-page__status-card">
        <div className="admin-order-detail-page__status-icon">
          {getStatusIcon(order.orderStatus)}
        </div>
        <div className="admin-order-detail-page__status-info">
          <p className="admin-order-detail-page__status-label">Order Status</p>
          <p className={`admin-order-detail-page__status-value admin-order-detail-page__status-value--${order.orderStatus}`}>
            {order.orderStatus.toUpperCase()}
          </p>
        </div>
      </div>

      {/* Payment Status */}
      <div className="admin-order-detail-page__status-card">
        <div className="admin-order-detail-page__status-icon">
          {getStatusIcon(order.paymentStatus)}
        </div>
        <div className="admin-order-detail-page__status-info">
          <p className="admin-order-detail-page__status-label">Payment Status</p>
          <p className={`admin-order-detail-page__status-value admin-order-detail-page__status-value--${order.paymentStatus}`}>
            {order.paymentStatus.toUpperCase()}
          </p>
        </div>
      </div>

      {/* Order Total */}
      <div className="admin-order-detail-page__status-card">
        <div className="admin-order-detail-page__status-icon">
          <FiBarChart2 />
        </div>
        <div className="admin-order-detail-page__status-info">
          <p className="admin-order-detail-page__status-label">Order Total</p>
          <p className="admin-order-detail-page__status-value admin-order-detail-page__status-value--total">
            ₹{order.totalAmount?.toLocaleString('en-IN')}
          </p>
        </div>
      </div>
    </div>
  );
}
