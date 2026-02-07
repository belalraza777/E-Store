// Orders.jsx - Admin order management page with filtering and search
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiSearch, FiRefreshCw, FiCreditCard, FiClock, FiAlertCircle, FiBarChart2 } from 'react-icons/fi';
import useOrderStore from '../../../../store/orderStore.js';
import './Orders.css';
import Skeleton from '../../../../components/ui/Skeleton/Skeleton.jsx';
import { computeStats, getUniqueCities, filterOrders } from '../../../../helper/orderHelpers.js';

export default function AdminOrders() {
  // Get orders data and fetch function from store
  const { orders, loading, fetchAllOrders } = useOrderStore();
  // Filter by order status
  const [filterStatus, setFilterStatus] = useState('');
  // Search term for customer/order search
  const [searchTerm, setSearchTerm] = useState('');
  // City filter for city-wise search
  const [cityFilter, setCityFilter] = useState('');

  // Load orders on mount
  useEffect(() => {
    loadOrders();
  }, []);

  // Fetch all orders from API
  const loadOrders = async () => {
    const result = await fetchAllOrders();
    if (!result.success) {
      toast.error(result.message || 'Failed to load orders');
    }
  };

  // Compute stats, cities and filtered orders using helper functions
  // Memoized computations
  const stats = useMemo(() => computeStats(orders), [orders]);
  const cities = useMemo(() => getUniqueCities(orders), [orders]);
  // Filter orders based on current filters and search term
  const filteredOrders = useMemo(() => {
    return filterOrders(orders, {
      filterStatus,
      searchTerm,
      cityFilter
    });
  }, [orders, filterStatus, searchTerm, cityFilter]);


  return (
    <div className="admin-orders-page">
      {/* Page Header with stats */}
      <div className="admin-orders-page__header">
        <div>
          <p className="admin-orders-page__eyebrow"><FiBarChart2 /> Admin</p>
          <h1>Orders Management</h1>
          <p className="admin-orders-page__subtext">Track and manage all customer orders</p>
        </div>
        {/* Quick stats display */}
        <div className="admin-orders-page__header-stats">
          <div className="admin-orders-page__stat">
            <div className="admin-orders-page__stat-value">{stats.total}</div>
            <div className="admin-orders-page__stat-label">Total Orders</div>
          </div>
          <div className="admin-orders-page__stat">
            <div className="admin-orders-page__stat-value">{stats.placed}</div>
            <div className="admin-orders-page__stat-label">Placed</div>
          </div>
          <div className="admin-orders-page__stat">
            <div className="admin-orders-page__stat-value">{stats.shipped}</div>
            <div className="admin-orders-page__stat-label">Shipped</div>
          </div>
          <div className="admin-orders-page__stat">
            <div className="admin-orders-page__stat-value">{stats.delivered}</div>
            <div className="admin-orders-page__stat-label">Delivered</div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="admin-orders-page__filter-section">
        {/* Search input */}
        <div className="admin-orders-page__search-box">
          <input
            type="text"
            placeholder="Search by customer name, email, or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-orders-page__search-input"
          />
          <FiSearch className="admin-orders-page__search-icon" />
        </div>
        {/* Status filter and refresh */}
        <div className="admin-orders-page__filter-controls">
          <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="admin-orders-page__filter-select admin-orders-page__city-select">
            <option value="">All Cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="admin-orders-page__filter-select">
            <option value="">All Orders ({orders.length})</option>
            <option value="placed">Placed ({stats.placed})</option>
            <option value="shipped">Shipped ({stats.shipped})</option>
            <option value="delivered">Delivered ({stats.delivered})</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button className="admin-orders-page__refresh-btn" onClick={loadOrders} disabled={loading}>
            <FiRefreshCw className={loading ? 'spinning' : ''} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Orders List */}
      {loading && orders.length === 0 ? (
        // Loading state
        <div className="admin-orders-page__loading" aria-busy="true">
          <Skeleton variant="circle" width="56px" height="56px" aria-label="Loading orders" />
          <Skeleton variant="text" width="240px" />
          <Skeleton variant="text" width="180px" />
        </div>
      ) : filteredOrders.length === 0 ? (
        // Empty state
        <div className="admin-orders-page__empty">
          <FiPackage size={48} />
          <p>No orders found</p>
          {(filterStatus || searchTerm || cityFilter) && <p className="admin-orders-page__empty-hint">Try adjusting your filters</p>}
        </div>
      ) : (
        // Orders cards grid
        <div className="admin-orders-page__orders-container">
          {filteredOrders.map((order) => (
            <Link key={order._id} to={`/admin/orders/${order._id}`} className="admin-orders-page__order-card">
              {/* Card header with order ID and status */}
              <div className="admin-orders-page__card-header">
                <div className="admin-orders-page__order-header-left">
                  <div className="admin-orders-page__order-id">#{order._id.slice(-6).toUpperCase()}</div>
                  <div className="admin-orders-page__order-date">{new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
                {/* Status badge with icon */}
                <div className={`admin-orders-page__status-badge admin-orders-page__status-badge--${order.orderStatus}`}>
                  {order.orderStatus === 'placed' && <FiPackage />}
                  {order.orderStatus === 'shipped' && <FiTruck />}
                  {order.orderStatus === 'delivered' && <FiCheckCircle />}
                  {order.orderStatus === 'cancelled' && <FiXCircle />}
                  <span>{order.orderStatus}</span>
                </div>
              </div>

              {/* Card body with order info */}
              <div className="admin-orders-page__card-body">
                <div className="admin-orders-page__info-grid">
                  {/* Customer info */}
                  <div className="admin-orders-page__info-item">
                    <div className="admin-orders-page__info-label">Customer</div>
                    <div className="admin-orders-page__info-value">{order.user?.name}</div>
                    <div className="admin-orders-page__info-detail">{order.user?.email}</div>
                  </div>
                  {/* Items count */}
                  <div className="admin-orders-page__info-item">
                    <div className="admin-orders-page__info-label">Items</div>
                    <div className="admin-orders-page__info-value">{order.items?.length}</div>
                    <div className="admin-orders-page__info-detail">item(s)</div>
                  </div>
                  {/* Total amount and payment status */}
                  <div className="admin-orders-page__info-item">
                    <div className="admin-orders-page__info-label">Total</div>
                    <div className="admin-orders-page__info-value">₹{order.totalAmount?.toFixed(2)}</div>
                    <div className="admin-orders-page__info-detail">
                      {order.paymentStatus === 'paid' ? (
                        <><FiCheckCircle className="admin-orders-page__status-icon-small" /> Paid</>
                      ) : (
                        <><FiClock className="admin-orders-page__status-icon-small" /> {order.paymentStatus}</>
                      )}
                    </div>
                  </div>
                  {/* Shipping location */}
                  <div className="admin-orders-page__info-item">
                    <div className="admin-orders-page__info-label">Location</div>
                    <div className="admin-orders-page__info-value">{order.shippingAddress?.city}</div>
                    <div className="admin-orders-page__info-detail">{order.shippingAddress?.postalCode}</div>
                  </div>
                </div>
              </div>

              {/* Card footer with payment and action */}
              <div className="admin-orders-page__card-footer">
                <div className="admin-orders-page__payment-status">
                  {order.paymentStatus === 'paid' && <><FiCreditCard /> Payment Complete</>}
                  {order.paymentStatus === 'pending' && <><FiClock /> Pending Payment</>}
                  {order.paymentStatus === 'failed' && <><FiAlertCircle /> Payment Failed</>}
                </div>
                <div className="admin-orders-page__action-hint">View Details →</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
