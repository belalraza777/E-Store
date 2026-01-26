// OrderDetail.jsx - Admin order detail page with status update functionality
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  FiPackage, 
  FiTruck, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock,
  FiUser,
  FiMapPin,
  FiInfo,
  FiShoppingCart,
  FiDollarSign,
  FiSettings,
  FiCreditCard,
  FiBarChart2,
  FiArrowLeft
} from 'react-icons/fi';
import './OrderDetail.css';
import useOrderStore from '../../../../store/orderStore.js';
import Skeleton from '../../../../components/ui/Skeleton/Skeleton.jsx';
// Styles loaded via main.css

export default function AdminOrderDetail() {
  // Get order ID from URL params
  const { id } = useParams();
  const navigate = useNavigate();
  // Get order data and update function from store
  const { orders, updateOrderStatus, loading } = useOrderStore();

  // Current order state
  const [order, setOrder] = useState(null);
  // Form state for status updates
  const [form, setForm] = useState({ orderStatus: '', paymentStatus: '' });
  // Track form submission
  const [submitting, setSubmitting] = useState(false);

  // Find order from store when ID changes
  useEffect(() => {
    const foundOrder = orders.find(o => o._id === id);
    if (foundOrder) {
      setOrder(foundOrder);
      // Initialize form with current status values
      setForm({
        orderStatus: foundOrder.orderStatus,
        paymentStatus: foundOrder.paymentStatus || 'pending',
      });
    }
  }, [id, orders]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle status update submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    // Validate order status
    if (!form.orderStatus) {
      toast.error('Order status is required');
      return;
    }

    setSubmitting(true);
    // Call API to update order status
    const result = await updateOrderStatus(id, {
      orderStatus: form.orderStatus,
      paymentStatus: form.paymentStatus,
    });
    setSubmitting(false);

    if (result.success) {
      toast.success('Order updated successfully');
      setOrder(result.data);
    } else {
      toast.error(result.message || 'Failed to update order');
    }
  };

  // Get appropriate icon for status type
  const getStatusIcon = (status) => {
    const icons = {
      placed: <FiPackage />,
      shipped: <FiTruck />,
      delivered: <FiCheckCircle />,
      cancelled: <FiXCircle />,
      pending: <FiClock />,
      paid: <FiCreditCard />,
      failed: <FiXCircle />,
    };
    return icons[status] || <FiInfo />;
  };

  // Show loading while order is being fetched
  if (!order) {
    return (
      <div className="admin-order-detail-page">
        <div className="admin-order-detail-page__loading" aria-busy="true">
          <Skeleton variant="circle" width="56px" height="56px" aria-label="Loading order details" />
          <Skeleton variant="text" width="280px" />
          <Skeleton variant="text" width="220px" />
        </div>
      </div>
    );
  }

  // Helper functions for date formatting
  const formatDate = (date) => new Date(date).toLocaleDateString();
  const formatDateTime = (date) => new Date(date).toLocaleString();
  // Calculate subtotal and discount from items
  const subtotal = order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const discount = order.items?.reduce((sum, item) => sum + (item.discount * item.quantity), 0) || 0;

  return (
    <div className="admin-order-detail-page">
      {/* Page Header */}
      <div className="admin-order-detail-page__header">
        <div className="admin-order-detail-page__header-content">
          <button onClick={() => navigate(-1)} className="admin-order-detail-page__back-btn"><FiArrowLeft /> Back to Orders</button>
          <p className="admin-order-detail-page__eyebrow">Order Details</p>
          <h1>Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p className="admin-order-detail-page__order-date">Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>

      <div className="admin-order-detail-page__detail-content">
        {/* Status Overview Cards */}
        <div className="admin-order-detail-page__status-overview">
          {/* Order Status Card */}
          <div className="admin-order-detail-page__status-card">
            <div className="admin-order-detail-page__status-icon">{getStatusIcon(order.orderStatus)}</div>
            <div className="admin-order-detail-page__status-info">
              <p className="admin-order-detail-page__status-label">Order Status</p>
              <p className={`admin-order-detail-page__status-value admin-order-detail-page__status-value--${order.orderStatus}`}>{order.orderStatus.toUpperCase()}</p>
            </div>
          </div>
          {/* Payment Status Card */}
          <div className="admin-order-detail-page__status-card">
            <div className="admin-order-detail-page__status-icon">{getStatusIcon(order.paymentStatus)}</div>
            <div className="admin-order-detail-page__status-info">
              <p className="admin-order-detail-page__status-label">Payment Status</p>
              <p className={`admin-order-detail-page__status-value admin-order-detail-page__status-value--${order.paymentStatus}`}>{order.paymentStatus.toUpperCase()}</p>
            </div>
          </div>
          {/* Order Total Card */}
          <div className="admin-order-detail-page__status-card">
            <div className="admin-order-detail-page__status-icon"><FiBarChart2 /></div>
            <div className="admin-order-detail-page__status-info">
              <p className="admin-order-detail-page__status-label">Order Total</p>
              <p className="admin-order-detail-page__status-value admin-order-detail-page__status-value--total">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        <div className="admin-order-detail-page__detail-grid">
          {/* Customer Information Card */}
          <section className="admin-order-detail-page__card">
            <div className="admin-order-detail-page__card-header">
              <h2><FiUser /> Customer Information</h2>
            </div>
            <div className="admin-order-detail-page__card-body">
              <div className="admin-order-detail-page__info-grid">
                <div className="admin-order-detail-page__info-item">
                  <span className="admin-order-detail-page__label">Name</span>
                  <span className="admin-order-detail-page__value">{order.user?.name || 'N/A'}</span>
                </div>
                <div className="admin-order-detail-page__info-item">
                  <span className="admin-order-detail-page__label">Email</span>
                  <span className="admin-order-detail-page__value">{order.user?.email || 'N/A'}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Shipping Address Card */}
          <section className="admin-order-detail-page__card">
            <div className="admin-order-detail-page__card-header">
              <h2><FiMapPin /> Shipping Address</h2>
            </div>
            <div className="admin-order-detail-page__card-body">
              <div className="admin-order-detail-page__address-box">
                <p><strong>{order.shippingAddress?.address}</strong></p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                <p>{order.shippingAddress?.country}</p>
              </div>
            </div>
          </section>

          {/* Order Information Card */}
          <section className="admin-order-detail-page__card">
            <div className="admin-order-detail-page__card-header">
              <h2><FiInfo /> Order Information</h2>
            </div>
            <div className="admin-order-detail-page__card-body">
              <div className="admin-order-detail-page__info-grid">
                <div className="admin-order-detail-page__info-item">
                  <span className="admin-order-detail-page__label">Order ID</span>
                  <span className="admin-order-detail-page__value admin-order-detail-page__value--mono">{order._id}</span>
                </div>
                <div className="admin-order-detail-page__info-item">
                  <span className="admin-order-detail-page__label">Payment Method</span>
                  <span className="admin-order-detail-page__value">{order.paymentMethod}</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Order Items Table */}
        <section className="admin-order-detail-page__card admin-order-detail-page__card--full-width">
          <div className="admin-order-detail-page__card-header">
            <h2><FiShoppingCart /> Order Items ({order.items?.length})</h2>
          </div>
          <div className="admin-order-detail-page__card-body">
            <div className="admin-order-detail-page__items-table">
              {/* Table header */}
              <div className="admin-order-detail-page__table-header">
                <div className="admin-order-detail-page__product-col">Product</div>
                <div className="admin-order-detail-page__price-col">Price</div>
                <div className="admin-order-detail-page__qty-col">Qty</div>
                <div className="admin-order-detail-page__discount-col">Discount</div>
                <div className="admin-order-detail-page__total-col">Total</div>
              </div>
              {/* Item rows */}
              {order.items?.map((item, idx) => (
                <div key={idx} className="admin-order-detail-page__table-row">
                  <div className="admin-order-detail-page__product-col">
                    <div className="admin-order-detail-page__product-name">{item.product?.title}</div>
                    <div className="admin-order-detail-page__product-slug">{item.product?.slug}</div>
                  </div>
                  <div className="admin-order-detail-page__price-col">₹{item.price?.toLocaleString('en-IN')}</div>
                  <div className="admin-order-detail-page__qty-col">{item.quantity}</div>
                  <div className="admin-order-detail-page__discount-col">₹{item.discount?.toLocaleString('en-IN')}</div>
                  <div className="admin-order-detail-page__total-col"><strong>₹{(item.price * item.quantity)?.toLocaleString('en-IN')}</strong></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Order Totals Section */}
        <section className="admin-order-detail-page__card admin-order-detail-page__card--full-width">
          <div className="admin-order-detail-page__card-header">
            <h2><FiDollarSign /> Order Totals</h2>
          </div>
          <div className="admin-order-detail-page__card-body">
            <div className="admin-order-detail-page__totals-box">
              {/* Subtotal */}
              <div className="admin-order-detail-page__total-row">
                <span className="admin-order-detail-page__total-label">Subtotal</span>
                <span className="admin-order-detail-page__total-amount">₹{subtotal?.toLocaleString('en-IN')}</span>
              </div>
              {/* Discount */}
              <div className="admin-order-detail-page__total-row">
                <span className="admin-order-detail-page__total-label">Discount</span>
                <span className="admin-order-detail-page__total-amount admin-order-detail-page__total-amount--discount">-₹{Math.max(0, discount)?.toLocaleString('en-IN')}</span>
              </div>
              {/* Grand Total */}
              <div className="admin-order-detail-page__total-row admin-order-detail-page__total-row--grand-total">
                <span className="admin-order-detail-page__total-label">Total Amount</span>
                <span className="admin-order-detail-page__total-amount">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Status Update Form Section */}
        <section className="admin-order-detail-page__card admin-order-detail-page__card--full-width">
          <div className="admin-order-detail-page__card-header">
            <h2><FiSettings /> Update Status</h2>
          </div>
          <div className="admin-order-detail-page__card-body">
            <form onSubmit={handleSubmit} className="admin-order-detail-page__status-update-form">
              <div className="admin-order-detail-page__update-grid">
                {/* Order Status Dropdown */}
                <div className="admin-order-detail-page__update-box">
                  <label className="admin-order-detail-page__form-label">Order Status</label>
                  <p className="admin-order-detail-page__update-desc">Update the fulfillment status of this order</p>
                  <select name="orderStatus" value={form.orderStatus} onChange={handleChange} required className="admin-order-detail-page__form-select">
                    <option value="">Select status</option>
                    <option value="placed">Placed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                {/* Payment Status Dropdown */}
                <div className="admin-order-detail-page__update-box">
                  <label className="admin-order-detail-page__form-label">Payment Status</label>
                  <p className="admin-order-detail-page__update-desc">Update the payment status of this order</p>
                  <select name="paymentStatus" value={form.paymentStatus} onChange={handleChange} className="admin-order-detail-page__form-select">
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>
              {/* Submit Button */}
              <button type="submit" disabled={submitting || loading} className="admin-order-detail-page__submit-btn">
                {submitting ? 'Updating...' : <><FiCheckCircle /> Update Status</>}
              </button>
            </form>

            {/* Show cancellation reason if order was cancelled */}
            {order.cancelReason && (
              <div className="admin-order-detail-page__cancel-reason-box">
                <strong>Cancellation Reason:</strong> {order.cancelReason}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
