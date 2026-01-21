// Orders.jsx - User's order history page showing all past and current orders
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useOrderStore from '../../store/orderStore';
import { toast } from 'sonner';
// Styles loaded via main.css

export default function Orders() {
    // Get order state and actions from store
    const { orders, loading, fetchMyOrders } = useOrderStore();
    // Active filter tab (all, placed, shipped, delivered, cancelled)
    const [activeFilter, setActiveFilter] = useState('all');

    // Fetch orders on mount
    useEffect(() => {
        fetchMyOrders();
    }, []);

    // Filter orders based on active tab
    const filteredOrders = orders.filter(order => {
        if (activeFilter === 'all') return true;
        return order.orderStatus === activeFilter;
    });

    // Format date for display
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Show loading state
    if (loading && orders.length === 0) {
        return (
            <div className="orders-page">
                <div className="loading-container">
                    <div className="spinner-large"></div>
                    <p>Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-page">
            {/* Page Title */}
            <h1>My Orders</h1>
            <p className="subtext">Track and manage your orders</p>

            {/* Filter Tabs - filter orders by status */}
            <div className="orders-filter-bar">
                {['all', 'placed', 'shipped', 'delivered', 'cancelled'].map(filter => (
                    <button
                        key={filter}
                        className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                        onClick={() => setActiveFilter(filter)}
                    >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                ))}
            </div>

            {/* Orders List - shows filtered orders */}
            {filteredOrders.length === 0 ? (
                // Empty state when no orders match filter
                <div className="empty-orders">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                        <rect x="9" y="3" width="6" height="4" rx="1" />
                        <path d="M9 12h6M9 16h6" />
                    </svg>
                    <h2>No orders found</h2>
                    <p>{activeFilter === 'all' ? "You haven't placed any orders yet" : `No ${activeFilter} orders`}</p>
                    <Link to="/products" className="start-shopping-btn">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                // Render order cards
                <div className="orders-list">
                    {filteredOrders.map(order => (
                        <div key={order._id} className="order-card">
                            {/* Order Header - ID, date, status badges */}
                            <div className="order-header">
                                <div className="order-meta">
                                    <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                                    <span className="order-date">Placed on {formatDate(order.createdAt)}</span>
                                </div>
                                <div className="order-status-badges">
                                    {/* Order status badge */}
                                    <span className={`status-badge ${order.orderStatus}`}>
                                        {order.orderStatus}
                                    </span>
                                    {/* Payment status badge */}
                                    <span className={`status-badge ${order.paymentStatus === 'paid' ? 'paid' : 'pending'}`}>
                                        {order.paymentStatus}
                                    </span>
                                </div>
                            </div>

                            {/* Order Items - list of products in order */}
                            <div className="order-items">
                                {order.items.slice(0, 3).map(item => (
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
                                            <h4 className="order-item-name">{item.product?.title || 'Product'}</h4>
                                            <p className="order-item-meta">Qty: {item.quantity}</p>
                                        </div>
                                        {/* Item price - use discount if available, else regular price */}
                                        <div className="order-item-price">
                                            <p className="order-item-unit">₹{Number(item.discount || item.price).toLocaleString()}</p>
                                            <p className="order-item-total">₹{Number((item.discount || item.price) * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                                {/* Show more items indicator if order has more than 3 items */}
                                {order.items.length > 3 && (
                                    <p className="order-item-meta" style={{ textAlign: 'center', padding: '0.5rem' }}>
                                        +{order.items.length - 3} more items
                                    </p>
                                )}
                            </div>

                            {/* Order Footer - total and actions */}
                            <div className="order-footer">
                                <div className="order-total">
                                    <span className="order-total-label">Total Amount</span>
                                    <span className="order-total-amount">₹{Number(order.totalAmount).toLocaleString()}</span>
                                </div>
                                <div className="order-actions">
                                    {/* View order detail link */}
                                    <Link to={`/orders/${order._id}`} className="view-order-btn">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
