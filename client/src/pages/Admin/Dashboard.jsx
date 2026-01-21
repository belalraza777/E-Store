// Dashboard.jsx - Admin dashboard with stats, recent orders, and low stock alerts
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiShoppingBag, 
  FiPackage, 
  FiUsers, 
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiAlertCircle,
  FiArrowRight,
  FiBarChart2,
  FiShoppingCart
} from 'react-icons/fi';
import useOrderStore from '../../store/orderStore.js';
import useProductStore from '../../store/productStore.js';
// Helper functions for calculating stats
import { 
  calculateTotalRevenue,
  calculateTodayStats,
  calculatePendingOrders,
  calculateLowStockProducts,
  getRecentOrders, 
  getLowStockProducts 
} from '../../helper/adminStatsHelper.js';
// Styles loaded via main.css

export default function AdminDashboard() {
  // Get orders and products data from stores
  const { orders, loading: ordersLoading, fetchAllOrders } = useOrderStore();
  const { products, loading: productsLoading, fetchProducts } = useProductStore();
  // Calculated stats state
  const [stats, setStats] = useState(null);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Recalculate stats when orders or products change
  useEffect(() => {
    if (orders.length > 0 || products.length > 0) {
      calculateStats();
    }
  }, [orders, products]);

  // Fetch all orders and products
  const loadData = async () => {
    await fetchAllOrders();
    await fetchProducts({ page: 1, limit: 100 });
  };

  // Calculate dashboard statistics
  const calculateStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Calculate today's revenue
    const todayOrders = orders.filter(o => new Date(o.createdAt) >= today);
    const todayRevenue = todayOrders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    // Calculate yesterday's revenue for comparison
    const yesterdayOrders = orders.filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate >= yesterday && orderDate < today;
    });
    const yesterdayRevenue = yesterdayOrders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    // Calculate revenue growth percentage
    const revenueGrowth = yesterdayRevenue > 0 
      ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 
      : 0;

    // Set all stats using helper functions
    setStats({
      revenue: calculateTotalRevenue(orders),
      totalOrders: orders.length,
      totalProducts: products.length,
      pendingOrders: calculatePendingOrders(orders),
      lowStockProducts: calculateLowStockProducts(products),
      today: calculateTodayStats(orders),
      revenueGrowth,
    });
  };

  const loading = ordersLoading || productsLoading;

  // Show loading state
  if (loading && orders.length === 0) {
    return (
      <div className="admin-dashboard">
        <div className="loading-box">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Wait for stats to be calculated
  if (!stats) return null;

  // Get recent orders and low stock products for display
  const recentOrders = getRecentOrders(orders, 5);
  const lowStockItems = getLowStockProducts(products, 10, 5);

  return (
    <div className="admin-dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <p className="eyebrow"><FiBarChart2 /> Admin</p>
          <h1>Dashboard</h1>
          <p className="subtext">Overview of your e-store performance</p>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="stats-grid">
        {/* Revenue Card */}
        <div className="stat-card revenue">
          <div className="stat-icon">
            <FiDollarSign />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Revenue</p>
            <h2 className="stat-value">₹{stats.revenue.toLocaleString('en-IN')}</h2>
            <div className="stat-footer">
              {/* Growth indicator - positive or negative */}
              <span className={`stat-change ${stats.revenueGrowth >= 0 ? 'positive' : 'negative'}`}>
                {stats.revenueGrowth >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                {Math.abs(stats.revenueGrowth).toFixed(1)}% from yesterday
              </span>
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <div className="stat-card orders">
          <div className="stat-icon">
            <FiShoppingCart />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Orders</p>
            <h2 className="stat-value">{stats.totalOrders}</h2>
            <div className="stat-footer">
              <span className="stat-detail">{stats.today.orders} orders today</span>
            </div>
          </div>
        </div>

        {/* Products Card */}
        <div className="stat-card products">
          <div className="stat-icon">
            <FiShoppingBag />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Products</p>
            <h2 className="stat-value">{stats.totalProducts}</h2>
            <div className="stat-footer">
              <span className="stat-detail">
                <FiAlertCircle /> {stats.lowStockProducts} low stock
              </span>
            </div>
          </div>
        </div>

        {/* Pending Orders Card */}
        <div className="stat-card pending">
          <div className="stat-icon">
            <FiClock />
          </div>
          <div className="stat-content">
            <p className="stat-label">Pending Orders</p>
            <h2 className="stat-value">{stats.pendingOrders}</h2>
            <div className="stat-footer">
              <span className="stat-detail">Requires attention</span>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Performance Section */}
      <div className="today-stats">
        <div className="section-header">
          <h3>Today's Performance</h3>
        </div>
        <div className="today-grid">
          {/* Today's Orders */}
          <div className="today-card">
            <div className="today-icon">
              <FiShoppingCart />
            </div>
            <div>
              <p className="today-label">Orders</p>
              <p className="today-value">{stats.today.orders}</p>
            </div>
          </div>
          {/* Today's Revenue */}
          <div className="today-card">
            <div className="today-icon">
              <FiDollarSign />
            </div>
            <div>
              <p className="today-label">Revenue</p>
              <p className="today-value">₹{stats.today.revenue.toLocaleString('en-IN')}</p>
            </div>
          </div>
          {/* Pending Count */}
          <div className="today-card">
            <div className="today-icon">
              <FiPackage />
            </div>
            <div>
              <p className="today-label">Pending</p>
              <p className="today-value">{stats.pendingOrders}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Recent Orders Section */}
        <section className="dashboard-section">
          <div className="section-header">
            <h3><FiPackage /> Recent Orders</h3>
            <Link to="/admin/orders" className="view-all">
              View All <FiArrowRight />
            </Link>
          </div>
          
          {/* Empty state or orders table */}
          {recentOrders.length === 0 ? (
            <div className="empty-state">
              <FiPackage size={40} />
              <p>No orders yet</p>
            </div>
          ) : (
            <div className="orders-table">
              {/* Table header */}
              <div className="table-header">
                <div className="col-id">Order ID</div>
                <div className="col-customer">Customer</div>
                <div className="col-amount">Amount</div>
                <div className="col-status">Status</div>
                <div className="col-date">Date</div>
              </div>
              {/* Order rows */}
              {recentOrders.map((order) => (
                <Link 
                  key={order._id} 
                  to={`/admin/orders/${order._id}`}
                  className="table-row"
                >
                  <div className="col-id">#{order._id.slice(-6).toUpperCase()}</div>
                  <div className="col-customer">
                    <div className="customer-name">{order.user?.name}</div>
                    <div className="customer-email">{order.user?.email}</div>
                  </div>
                  <div className="col-amount">₹{order.totalAmount?.toLocaleString('en-IN')}</div>
                  {/* Status badge with icon */}
                  <div className="col-status">
                    <span className={`status-badge status-${order.orderStatus}`}>
                      {order.orderStatus === 'placed' && <FiPackage />}
                      {order.orderStatus === 'shipped' && <FiTruck />}
                      {order.orderStatus === 'delivered' && <FiCheckCircle />}
                      {order.orderStatus === 'cancelled' && <FiAlertCircle />}
                      {order.orderStatus}
                    </span>
                  </div>
                  <div className="col-date">{new Date(order.createdAt).toLocaleDateString()}</div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Low Stock Products Section */}
        <section className="dashboard-section">
          <div className="section-header">
            <h3><FiAlertCircle /> Low Stock Alert</h3>
            <Link to="/admin/products" className="view-all">
              View All <FiArrowRight />
            </Link>
          </div>
          
          {/* Empty state or stock list */}
          {lowStockItems.length === 0 ? (
            <div className="empty-state">
              <FiCheckCircle size={40} />
              <p>All products have sufficient stock</p>
            </div>
          ) : (
            <div className="stock-list">
              {/* List low stock products */}
              {lowStockItems.map((product) => (
                <Link
                  key={product._id}
                  to={`/admin/products/${product.slug}/edit`}
                  className="stock-item"
                >
                  <div className="stock-product">
                    <img 
                      src={product.images?.[0] || '/placeholder.jpg'} 
                      alt={product.title}
                      className="stock-image"
                    />
                    <div className="stock-info">
                      <p className="stock-name">{product.title}</p>
                      <p className="stock-category">{product.category}</p>
                    </div>
                  </div>
                  {/* Stock count with status class */}
                  <div className={`stock-count ${(product.stock || 0) === 0 ? 'out-of-stock' : 'low-stock'}`}>
                    {product.stock || 0} left
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Quick Actions Grid */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <Link to="/admin/products/new" className="action-card">
            <FiShoppingBag size={24} />
            <span>Add Product</span>
          </Link>
          <Link to="/admin/orders" className="action-card">
            <FiPackage size={24} />
            <span>Manage Orders</span>
          </Link>
          <Link to="/admin/products" className="action-card">
            <FiShoppingCart size={24} />
            <span>View Products</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
