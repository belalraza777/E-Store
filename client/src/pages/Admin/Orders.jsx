// Orders.jsx - Admin order management page with filtering and search
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  FiPackage, 
  FiTruck, 
  FiCheckCircle, 
  FiXCircle, 
  FiSearch, 
  FiRefreshCw,
  FiCreditCard,
  FiClock,
  FiAlertCircle,
  FiBarChart2
} from 'react-icons/fi';
import useOrderStore from '../../store/orderStore.js';


export default function AdminOrders() {
  // Get orders data and fetch function from store
  const { orders, loading, fetchAllOrders } = useOrderStore();
  // Filter by order status
  const [filterStatus, setFilterStatus] = useState('');
  // Search term for customer/order search
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filter orders by status and search term
  const filteredOrders = orders.filter(order => {
    const matchesStatus = !filterStatus || order.orderStatus === filterStatus;
    const matchesSearch = !searchTerm || 
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate order status counts
  const stats = {
    total: orders.length,
    placed: orders.filter(o => o.orderStatus === 'placed').length,
    shipped: orders.filter(o => o.orderStatus === 'shipped').length,
    delivered: orders.filter(o => o.orderStatus === 'delivered').length,
  };

  return (
    <div className="admin-orders-page">
      {/* Page Header with stats */}
      <div className="admin-orders-header">
        <div>
          <p className="eyebrow"><FiBarChart2 /> Admin</p>
          <h1>Orders Management</h1>
          <p className="subtext">Track and manage all customer orders</p>
        </div>
        {/* Quick stats display */}
        <div className="header-stats">
          <div className="stat">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Orders</div>
          </div>
          <div className="stat">
            <div className="stat-value">{stats.placed}</div>
            <div className="stat-label">Placed</div>
          </div>
          <div className="stat">
            <div className="stat-value">{stats.shipped}</div>
            <div className="stat-label">Shipped</div>
          </div>
          <div className="stat">
            <div className="stat-value">{stats.delivered}</div>
            <div className="stat-label">Delivered</div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="filter-section">
        {/* Search input */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by customer name, email, or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <FiSearch className="search-icon" />
        </div>
        {/* Status filter and refresh */}
        <div className="filter-controls">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
            <option value="">All Orders ({orders.length})</option>
            <option value="placed">Placed ({stats.placed})</option>
            <option value="shipped">Shipped ({stats.shipped})</option>
            <option value="delivered">Delivered ({stats.delivered})</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button className="refresh-btn" onClick={loadOrders} disabled={loading}>
            <FiRefreshCw className={loading ? 'spinning' : ''} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Orders List */}
      {loading && orders.length === 0 ? (
        // Loading state
        <div className="loading-box">
          <div className="spinner"></div>
          <p>Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        // Empty state
        <div className="empty-box">
          <FiPackage size={48} />
          <p>No orders found</p>
          {(filterStatus || searchTerm) && <p className="empty-hint">Try adjusting your filters</p>}
        </div>
      ) : (
        // Orders cards grid
        <div className="orders-container">
          {filteredOrders.map((order) => (
            <Link key={order._id} to={`/admin/orders/${order._id}`} className="order-card">
              {/* Card header with order ID and status */}
              <div className="card-header">
                <div className="order-header-left">
                  <div className="order-id">#{order._id.slice(-6).toUpperCase()}</div>
                  <div className="order-date">{new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
                {/* Status badge with icon */}
                <div className={`status-badge status-${order.orderStatus}`}>
                  {order.orderStatus === 'placed' && <FiPackage />}
                  {order.orderStatus === 'shipped' && <FiTruck />}
                  {order.orderStatus === 'delivered' && <FiCheckCircle />}
                  {order.orderStatus === 'cancelled' && <FiXCircle />}
                  <span>{order.orderStatus}</span>
                </div>
              </div>

              {/* Card body with order info */}
              <div className="card-body">
                <div className="info-grid">
                  {/* Customer info */}
                  <div className="info-item">
                    <div className="info-label">Customer</div>
                    <div className="info-value">{order.user?.name}</div>
                    <div className="info-detail">{order.user?.email}</div>
                  </div>
                  {/* Items count */}
                  <div className="info-item">
                    <div className="info-label">Items</div>
                    <div className="info-value">{order.items?.length}</div>
                    <div className="info-detail">item(s)</div>
                  </div>
                  {/* Total amount and payment status */}
                  <div className="info-item">
                    <div className="info-label">Total</div>
                    <div className="info-value">₹{order.totalAmount?.toFixed(2)}</div>
                    <div className="info-detail">
                      {order.paymentStatus === 'paid' ? (
                        <><FiCheckCircle className="status-icon-small" /> Paid</>
                      ) : (
                        <><FiClock className="status-icon-small" /> {order.paymentStatus}</>
                      )}
                    </div>
                  </div>
                  {/* Shipping location */}
                  <div className="info-item">
                    <div className="info-label">Location</div>
                    <div className="info-value">{order.shippingAddress?.city}</div>
                    <div className="info-detail">{order.shippingAddress?.postalCode}</div>
                  </div>
                </div>
              </div>

              {/* Card footer with payment and action */}
              <div className="card-footer">
                <div className="payment-status">
                  {order.paymentStatus === 'paid' && <><FiCreditCard /> Payment Complete</>}
                  {order.paymentStatus === 'pending' && <><FiClock /> Pending Payment</>}
                  {order.paymentStatus === 'failed' && <><FiAlertCircle /> Payment Failed</>}
                </div>
                <div className="action-hint">View Details →</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
