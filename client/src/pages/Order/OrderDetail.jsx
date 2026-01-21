// OrderDetail.jsx - Detailed view of a single order with status tracking
import React, { useEffect, useState } from 'react';
import CancelOrderModal from './CancelOrderModal';
import { Link, useParams, useNavigate } from 'react-router-dom';
import useOrderStore from '../../store/orderStore';
import { toast } from 'sonner';
// Styles loaded via main.css

export default function OrderDetail() {
  // Get order ID from URL params
  const { id } = useParams();
  const navigate = useNavigate();
  // Get order state and actions from store
  const { currentOrder, loading, fetchOrderById, cancelOrder, clearCurrentOrder } = useOrderStore();
  // Cancel modal state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  // Fetch order on mount
  useEffect(() => {
    fetchOrderById(id);
    // Clear current order on unmount
    return () => clearCurrentOrder();
  }, [id]);

  // Handle order cancellation
  const handleCancelSubmit = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }
    setCancelling(true);
    const result = await cancelOrder(id, cancelReason);
    setCancelling(false);
    setShowCancelModal(false);
    if (result.success) {
      toast.success('Order cancelled successfully');
      // Refresh order data
      fetchOrderById(id);
    } else {
      toast.error(result.message || 'Failed to cancel order');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Define order status steps for tracker
  const statusSteps = ['placed', 'shipped', 'delivered'];
  
  // Get current step index based on order status
  const getCurrentStepIndex = (status) => {
    if (status === 'cancelled') return -1;
    return statusSteps.indexOf(status);
  };

  // Show loading state
  if (loading || !currentOrder) {
    return (
      <div className="order-detail-page">
        <div className="loading-container">
          <div className="spinner-large"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  const order = currentOrder;
  const currentStepIndex = getCurrentStepIndex(order.orderStatus);

  return (
    <div className="order-detail-page">
      {/* Header with back link */}
      <div className="order-detail-header">
        <Link to="/orders" className="back-link">
          ← Back to Orders
        </Link>
        <h1>Order #{order._id.slice(-8).toUpperCase()}</h1>
        <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
      </div>

      {/* Order Status Tracker - visual progress indicator */}
      {order.orderStatus !== 'cancelled' ? (
        <div className="order-tracker">
          <div className="tracker-steps">
            {statusSteps.map((status, index) => (
              <div 
                key={status}
                className={`tracker-step ${
                  index < currentStepIndex ? 'completed' : 
                  index === currentStepIndex ? 'active' : ''
                }`}
              >
                <div className="tracker-icon">
                  {index < currentStepIndex ? '✓' : 
                   status === 'placed' ? '📋' :
                   status === 'shipped' ? '🚚' : '📦'}
                </div>
                <span className="tracker-label">
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
                {index <= currentStepIndex && order[`${status}At`] && (
                  <span className="tracker-date">
                    {formatDate(order[`${status}At`])}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Cancelled order banner
        <div className="order-tracker" style={{ background: 'rgba(239, 68, 68, 0.1)', textAlign: 'center' }}>
          <p style={{ color: 'var(--danger)', fontWeight: 600, margin: 0 }}>
            ❌ This order was cancelled
          </p>
          {order.cancelReason && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0.5rem 0 0' }}>
              Reason: {order.cancelReason}
            </p>
          )}
        </div>
      )}

      {/* Order Details Grid */}
      <div className="order-detail-grid">
        {/* Shipping Address Card */}
        <div className="detail-card">
          <h3>📍 Shipping Address</h3>
          <p>
            <span className="highlight">{order.shippingAddress?.address}</span><br />
            {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}<br />
            {order.shippingAddress?.country}
          </p>
        </div>

        {/* Payment Info Card */}
        <div className="detail-card">
          <h3>💳 Payment Information</h3>
          <p>
            Method: <span className="highlight">{order.paymentMethod}</span><br />
            Status: <span className={`highlight ${order.paymentStatus === 'paid' ? 'text-success' : ''}`}>
              {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1)}
            </span>
          </p>
        </div>
      </div>

      {/* Order Items Card */}
      <div className="order-card" style={{ marginBottom: '1.5rem' }}>
        <div className="order-header">
          <h3 style={{ margin: 0 }}>Order Items ({order.items.length})</h3>
        </div>
        <div className="order-items">
          {order.items.map(item => (
            <div key={item._id} className="order-item">
              {/* Product image */}
              <div className="order-item-image">
                <img 
                  src={Array.isArray(item.product.images) && item.product.images[0] ? item.product.images[0].url : '/placeholder.png'} 
                  alt={item.product?.title || 'Product'} 
                />
              </div>
              {/* Product details */}
              <div className="order-item-details">
                <h4 className="order-item-name">
                  <Link to={`/products/${item.product?.slug}`}>
                    {item.product?.title || 'Product'}
                  </Link>
                </h4>
                <p className="order-item-meta">
                  Qty: {item.quantity} × ₹{Number(item.discount || item.price).toLocaleString()}
                </p>
              </div>
              {/* Item total - use discount if available, else regular price */}
              <div className="order-item-price">
                <p className="order-item-total">
                  ₹{Number((item.discount || item.price) * item.quantity).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Order Summary Footer */}
        <div className="order-footer">
          <div className="order-total">
            <span className="order-total-label">Order Total</span>
            <span className="order-total-amount">₹{Number(order.totalAmount).toLocaleString()}</span>
          </div>
          {/* Cancel button */}
          <div className="order-actions">
            {order.orderStatus === 'cancelled' ? (
              <button className="btn-cancelled" disabled>
                Cancelled
              </button>
            ) : order.orderStatus === 'shipped' || order.orderStatus === 'delivered' ? (
              <span className="order-status-info">
                Order {order.orderStatus}
              </span>
            ) : (
              <button 
                className="cancel-order-btn"
                onClick={() => setShowCancelModal(true)}
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>


      {/* Cancel Order Modal */}
      <CancelOrderModal
        show={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        cancelReason={cancelReason}
        setCancelReason={setCancelReason}
        onSubmit={handleCancelSubmit}
        cancelling={cancelling}
      />
    </div>
  );
}
