// OrderDetail.jsx
// Admin order detail page (container component)
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import useOrderStore from '../../../../store/orderStore.js';
import { getInvoiceData } from '../../../../helper/invoiceHelper';
import { generateCustomerInvoice } from '../../../../utils/bill';
import Skeleton from '../../../../components/ui/Skeleton/Skeleton.jsx';
import OrderStatusOverview from './OrderStatusOverview';
import OrderTotals from './OrderTotals';
import OrderStatusUpdateForm from './OrderStatusUpdateForm';

import {
  FiArrowLeft,
  FiUser,
  FiMapPin,
  FiInfo,
  FiShoppingCart,
} from 'react-icons/fi';

import './OrderDetail.css';

export default function AdminOrderDetail() {
  // Get order id from URL
  const { id } = useParams();
  const navigate = useNavigate();
  // Order store access
  const { orders, updateOrderStatus, loading, fetchAllOrders } = useOrderStore();
  // Local order state
  const [order, setOrder] = useState(null);
  // Status update form state
  const [form, setForm] = useState({ orderStatus: '', paymentStatus: '' });
  // Prevent duplicate submissions
  const [submitting, setSubmitting] = useState(false);

  // Load order from store or fetch if missing
  useEffect(() => {
    if (!orders || orders.length === 0) {
      fetchAllOrders();
      return;
    }
    // Find the order by ID from the store
    const foundOrder = orders.find(o => o._id === id);
    if (foundOrder) {
      setOrder(foundOrder);
      setForm({
        orderStatus: foundOrder.orderStatus,
        paymentStatus: foundOrder.paymentStatus || 'pending',
      });
    }
  }, [id, orders, fetchAllOrders]);

  // Handle select input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Submit order status update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!form.orderStatus && !form.paymentStatus) {
      toast.error('Order status and payment status are required');
      return;
    }

    setSubmitting(true);
    const result = await updateOrderStatus(id, form);
    setSubmitting(false);

    if (result.success) {
      toast.success('Order updated successfully');
      setOrder(result.data);
    } else {
      toast.error(result.message || 'Failed to update order');
    }
  };

  // Show loading skeleton
  if (!order) {
    return (
      <div className="admin-order-detail-page">
        <div className="admin-order-detail-page__loading">
          <Skeleton variant="circle" width="56px" height="56px" />
          <Skeleton variant="text" width="280px" />
          <Skeleton variant="text" width="220px" />
        </div>
      </div>
    );
  }

  // Price calculations 
  const subtotal = order?.subtotal; 
  const discount = subtotal - order?.totalAmount;
  const total = order?.totalAmount;

  return (
    <div className="admin-order-detail-page">
      {/* Page Header */}
      <div className="admin-order-detail-page__header">
        <div className="admin-order-detail-page__header-content">
          <button
            onClick={() => navigate(-1)}
            className="admin-order-detail-page__back-btn"
          >
            <FiArrowLeft /> Back to Orders
          </button>

          <p className="admin-order-detail-page__eyebrow">Order Details</p>
          <h1>Order #{order._id.slice(-8).toUpperCase()}</h1>

          <p className="admin-order-detail-page__order-date">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>

          <button
            className="admin-order-detail-page__invoice-btn"
            onClick={() =>
              generateCustomerInvoice(getInvoiceData(order))
            }
          >
            Download Invoice
          </button>
        </div>
      </div>

      <div className="admin-order-detail-page__detail-content">
        {/* Status cards */}
        <OrderStatusOverview order={order} />

        <div className="admin-order-detail-page__detail-grid">
          {/* Customer Info */}
          <section className="admin-order-detail-page__card">
            <div className="admin-order-detail-page__card-header">
              <h2><FiUser /> Customer Information</h2>
            </div>
            <div className="admin-order-detail-page__card-body">
              <p><strong>Name:</strong> {order.user?.name}</p>
              <p><strong>Email:</strong> {order.user?.email}</p>
            </div>
          </section>

          {/* Shipping Address */}
          <section className="admin-order-detail-page__card">
            <div className="admin-order-detail-page__card-header">
              <h2><FiMapPin /> Shipping Address</h2>
            </div>
            <div className="admin-order-detail-page__card-body">
              <p>{order.shippingAddress?.address}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
              <p>{order.shippingAddress?.country}</p>
            </div>
          </section>

          {/* Order Info */}
          <section className="admin-order-detail-page__card">
            <div className="admin-order-detail-page__card-header">
              <h2><FiInfo /> Order Information</h2>
            </div>
            <div className="admin-order-detail-page__card-body">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
            </div>
          </section>
        </div>

        {/* Order Items */}
        <section className="admin-order-detail-page__card admin-order-detail-page__card--full-width">
          <div className="admin-order-detail-page__card-header">
            <h2><FiShoppingCart /> Order Items ({order.items.length})</h2>
          </div>
          <div className="admin-order-detail-page__card-body">
            {order.items.map((item, i) => (
              <div key={i} className="admin-order-detail-page__table-row">
                <strong>{item.product?.title}</strong> × {item.quantity} — ₹
                {(item.price * item.quantity).toLocaleString('en-IN')}
              </div>
            ))}
          </div>
        </section>

        {/* Totals */}
        <OrderTotals
          subtotal={subtotal}
          discount={discount}
          total={total}
        />

        {/* Status Update */}
        <OrderStatusUpdateForm
          form={form}
          loading={loading}
          submitting={submitting}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />

        {/* Cancel reason */}
        {order.cancelReason && (
          <div className="admin-order-detail-page__cancel-reason-box">
            <strong>Cancellation Reason:</strong> {order.cancelReason}
          </div>
        )}
      </div>
    </div>
  );
}
