// Orders.jsx - User's order history page showing all past and current orders
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useOrderStore from '../../store/orderStore';
import { toast } from 'sonner';
import Skeleton from '../../components/ui/Skeleton/Skeleton.jsx';
import './Orders.css';

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
                <div className="orders-page__loading" aria-busy="true">
                    <Skeleton variant="circle" width="56px" height="56px" aria-label="Loading orders" />
                    <Skeleton variant="text" width="220px" />
                    <Skeleton variant="text" width="180px" />
                </div>
            </div>
        );
    }

    return (
        <div className="orders-page">
            {/* Page Title */}
            <h1 className="orders-page__title">My Orders</h1>
            <p className="orders-page__subtitle">Track and manage your orders</p>

            {/* Filter Tabs - filter orders by status */}
            <div className="orders-page__filters">
                {['all', 'placed', 'shipped', 'delivered', 'cancelled'].map(filter => (
                    <button
                        key={filter}
                        className={`orders-page__filter-btn ${activeFilter === filter ? 'orders-page__filter-btn--active' : ''}`}
                        onClick={() => setActiveFilter(filter)}
                    >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                ))}
            </div>

            {/* Orders List - shows filtered orders */}
            {filteredOrders.length === 0 ? (
                // Empty state when no orders match filter
                <div className="orders-page__empty">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                        <rect x="9" y="3" width="6" height="4" rx="1" />
                        <path d="M9 12h6M9 16h6" />
                    </svg>
                    <h2>No orders found</h2>
                    <p>{activeFilter === 'all' ? "You haven't placed any orders yet" : `No ${activeFilter} orders`}</p>
                    <Link to="/products" className="orders-page__empty-link">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                // Render order cards
                <div className="orders-page__list">
                    {filteredOrders.map(order => (
                        <div key={order._id} className="orders-page__card">
                            {/* Order Header - ID, date, status badges */}
                            <div className="orders-page__card-header">
                                <div className="orders-page__meta">
                                    <span className="orders-page__id">Order #{order._id.slice(-8).toUpperCase()}</span>
                                    <span className="orders-page__date">Placed on {formatDate(order.createdAt)}</span>
                                </div>
                                <div className="orders-page__badges">
                                    {/* Order status badge */}
                                    <span className={`orders-page__badge orders-page__badge--${order.orderStatus}`}>
                                        {order.orderStatus}
                                    </span>
                                    {/* Payment status badge */}
                                    <span className={`orders-page__badge orders-page__badge--${order.paymentStatus === 'paid' ? 'paid' : 'pending'}`}>
                                        {order.paymentStatus}
                                    </span>
                                </div>
                            </div>

                            {/* Order Items - list of products in order */}
                            <div className="orders-page__items">
                                {order.items.slice(0, 3).map(item => (
                                    <div key={item._id} className="orders-page__item">
                                        {/* Product image */}
                                        <div className="orders-page__item-image">
                                            <img
                                                src={Array.isArray(item.product.images) && item.product.images[0] ? item.product.images[0].url : '/placeholder.png'}
                                                alt={item.product?.title || 'Product'}
                                            />
                                        </div>
                                        {/* Product details */}
                                        <div>
                                            <h4 className="orders-page__item-title">{item.product?.title || 'Product'}</h4>
                                            <p className="orders-page__item-meta">Qty: {item.quantity}</p>
                                        </div>
                                        {/* Item price - use discount if available, else regular price */}
                                        <div className="orders-page__item-price">
                                            <p className="orders-page__item-meta">₹{Number(item.discount || item.price).toLocaleString()}</p>
                                            <p className="orders-page__item-total">₹{Number((item.discount || item.price) * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                                {/* Show more items indicator if order has more than 3 items */}
                                {order.items.length > 3 && (
                                    <p className="orders-page__more">
                                        +{order.items.length - 3} more items
                                    </p>
                                )}
                            </div>

                            {/* Order Footer - total and actions */}
                            <div className="orders-page__card-footer">
                                <div className="orders-page__total">
                                    <span className="orders-page__total-label">Total Amount</span>
                                    <span className="orders-page__total-amount">₹{Number(order.totalAmount).toLocaleString()}</span>
                                </div>
                                <div>
                                    {/* View order detail link */}
                                    <Link to={`/orders/${order._id}`} className="orders-page__view">
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
