// OrderDetail.jsx - Detailed view of a single order with status tracking
import React, { useEffect, useState } from 'react';
import { getInvoiceData } from '../../helper/invoiceHelper';
import { generateCustomerInvoice } from '../../utils/bill';
import CancelOrderModal from './CancelOrderModal';
import { Link, useParams, useNavigate } from 'react-router-dom';
import useOrderStore from '../../store/orderStore';
import { toast } from 'sonner';
import Skeleton from '../../components/ui/Skeleton/Skeleton.jsx';
import './OrderDetail.css';

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
      <div className="order-detail">
        <div className="order-detail__loading" aria-busy="true">
          <Skeleton variant="circle" width="56px" height="56px" aria-label="Loading order details" />
          <Skeleton variant="text" width="260px" />
          <Skeleton variant="text" width="200px" />
        </div>
      </div>
    );
  }

  const order = currentOrder;
  const currentStepIndex = getCurrentStepIndex(order.orderStatus);

  return (
    <div className="order-detail">
      {/* Header with back link */}
      <div className="order-detail__header">
        <Link to="/orders" className="order-detail__back">
          ← Back to Orders
        </Link>
        <h1>Order #{order._id.slice(-8).toUpperCase()}</h1>
        <p className="order-detail__date">Placed on {formatDate(order.createdAt)}</p>
        <button
          className="order-detail__button order-detail__button--invoice"
          onClick={() => generateCustomerInvoice(getInvoiceData(order))}
        >
          Download Invoice
        </button>
      </div>

      {/* Order Status Tracker - visual progress indicator */}
      {order.orderStatus !== 'cancelled' ? (
        <div className="order-detail__tracker">
          <div className="order-detail__steps">
            {statusSteps.map((status, index) => (
              <div
                key={status}
                className={`order-detail__step ${index < currentStepIndex ? 'order-detail__step--completed' :
                    index === currentStepIndex ? 'order-detail__step--active' : ''
                  }`}
              >
                <div className="order-detail__step-icon" aria-hidden="true">
                  {index < currentStepIndex ? '✓' :
                    status === 'placed' ? '📋' :
                      status === 'shipped' ? '🚚' : '📦'}
                </div>
                <div>
                  <div className="order-detail__step-label">{status.charAt(0).toUpperCase() + status.slice(1)}</div>
                  {index <= currentStepIndex && order[`${status}At`] && (
                    <div className="order-detail__step-date">{formatDate(order[`${status}At`])}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Cancelled order banner
        <div className="order-detail__tracker order-detail__tracker--cancelled">
          <p className="order-detail__cancelled-title">This order was cancelled</p>
          {order.cancelReason && (
            <p className="order-detail__cancelled-reason">
              Reason: {order.cancelReason}
            </p>
          )}
        </div>
      )}

      {/* Order Details Grid */}
      <div className="order-detail__grid">
        {/* Shipping Address Card */}
        <div className="order-detail__card">
          <h3 className="order-detail__card-title">Shipping Address</h3>
          <p>
            <span className="order-detail__highlight">{order.shippingAddress?.address}</span><br />
            {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}<br />
            {order.shippingAddress?.country}
          </p>
        </div>

        {/* Payment Info Card */}
        <div className="order-detail__card">
          <h3 className="order-detail__card-title">Payment Information</h3>
          <p>
            Method: <span className="order-detail__highlight">{order.paymentMethod}</span><br />
            Status: <span className="order-detail__highlight">
              {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1)}
            </span>
          </p>
        </div>
      </div>

      {/* Order Items Card */}
      <div className="order-detail__items-card">
        <div className="order-detail__items-header">
          <h3>Order Items ({order.items.length})</h3>
        </div>
        <div className="order-detail__items">
          {order.items.map(item => (
            <div key={item._id} className="order-detail__item">
              {/* Product image */}
              <div className="order-detail__item-image">
                <img
                  src={Array.isArray(item.product.images) && item.product.images[0] ? item.product.images[0].url : '/placeholder.png'}
                  alt={item.product?.title || 'Product'}
                />
              </div>
              {/* Product details */}
              <div>
                <h4 className="order-detail__item-name">
                  <Link to={`/products/${item.product?.slug}`}>
                    {item.product?.title || 'Product'}
                  </Link>
                </h4>
                <p className="order-detail__item-meta">
                  Qty: {item.quantity} × ₹{Number(item.discount || item.price).toLocaleString()}
                </p>
              </div>
              {/* Item total - use discount if available, else regular price */}
              <div>
                <p className="order-detail__item-total">
                  ₹{Number((item.discount || item.price) * item.quantity).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Footer */}
        <div className="order-detail__items-footer">
          <div className="order-detail__total">
            <span className="order-detail__total-label">Order Total</span>
            <span className="order-detail__total-amount">₹{Number(order.totalAmount).toLocaleString()}</span>
          </div>
          {/* Cancel button */}
          <div>
            {order.orderStatus === 'cancelled' ? (
              <button className="order-detail__button" disabled>
                Cancelled
              </button>
            ) : order.orderStatus === 'shipped' || order.orderStatus === 'delivered' ? (
              <span className="order-detail__highlight">
                Order {order.orderStatus}
              </span>
            ) : (
              <button
                className="order-detail__button order-detail__button--danger"
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
