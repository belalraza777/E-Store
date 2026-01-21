// Dashboard.jsx - Admin dashboard with stats, recent orders, and low stock alerts
import './Dashboard.css';
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
import Skeleton from '../../components/ui/Skeleton/Skeleton.jsx';
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
        <div className="admin-dashboard__loading" aria-busy="true">
          <Skeleton variant="circle" width="56px" height="56px" aria-label="Loading dashboard" />
          <Skeleton variant="text" width="260px" />
          <Skeleton variant="text" width="200px" />
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
      <div className="admin-dashboard__header">
        <div>
          <p className="admin-dashboard__eyebrow"><FiBarChart2 /> Admin</p>
          <h1>Dashboard</h1>
          <p className="admin-dashboard__subtext">Overview of your e-store performance</p>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="admin-dashboard__stats-grid">
        {/* Revenue Card */}
        <div className="admin-dashboard__stat-card admin-dashboard__stat-card--revenue">
          <div className="admin-dashboard__stat-icon">
            <FiDollarSign />
          </div>
          <div className="admin-dashboard__stat-content">
            <p className="admin-dashboard__stat-label">Total Revenue</p>
            <h2 className="admin-dashboard__stat-value">₹{stats.revenue.toLocaleString('en-IN')}</h2>
            <div className="admin-dashboard__stat-footer">
              {/* Growth indicator - positive or negative */}
              <span className={`admin-dashboard__stat-change ${stats.revenueGrowth >= 0 ? 'admin-dashboard__stat-change--positive' : 'admin-dashboard__stat-change--negative'}`}>
                {stats.revenueGrowth >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                {Math.abs(stats.revenueGrowth).toFixed(1)}% from yesterday
              </span>
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <div className="admin-dashboard__stat-card admin-dashboard__stat-card--orders">
          <div className="admin-dashboard__stat-icon">
            <FiShoppingCart />
          </div>
          <div className="admin-dashboard__stat-content">
            <p className="admin-dashboard__stat-label">Total Orders</p>
            <h2 className="admin-dashboard__stat-value">{stats.totalOrders}</h2>
            <div className="admin-dashboard__stat-footer">
              <span className="admin-dashboard__stat-detail">{stats.today.orders} orders today</span>
            </div>
          </div>
        </div>

        {/* Products Card */}
        <div className="admin-dashboard__stat-card admin-dashboard__stat-card--products">
          <div className="admin-dashboard__stat-icon">
            <FiShoppingBag />
          </div>
          <div className="admin-dashboard__stat-content">
            <p className="admin-dashboard__stat-label">Total Products</p>
            <h2 className="admin-dashboard__stat-value">{stats.totalProducts}</h2>
            <div className="admin-dashboard__stat-footer">
              <span className="admin-dashboard__stat-detail">
                <FiAlertCircle /> {stats.lowStockProducts} low stock
              </span>
            </div>
          </div>
        </div>

        {/* Pending Orders Card */}
        <div className="admin-dashboard__stat-card admin-dashboard__stat-card--pending">
          <div className="admin-dashboard__stat-icon">
            <FiClock />
          </div>
          <div className="admin-dashboard__stat-content">
            <p className="admin-dashboard__stat-label">Pending Orders</p>
            <h2 className="admin-dashboard__stat-value">{stats.pendingOrders}</h2>
            <div className="admin-dashboard__stat-footer">
              <span className="admin-dashboard__stat-detail">Requires attention</span>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Performance Section */}
      <div className="admin-dashboard__today-stats">
        <div className="admin-dashboard__section-header">
          <h3>Today's Performance</h3>
        </div>
        <div className="admin-dashboard__today-grid">
          {/* Today's Orders */}
          <div className="admin-dashboard__today-card">
            <div className="admin-dashboard__today-icon">
              <FiShoppingCart />
            </div>
            <div>
              <p className="admin-dashboard__today-label">Orders</p>
              <p className="admin-dashboard__today-value">{stats.today.orders}</p>
            </div>
          </div>
          {/* Today's Revenue */}
          <div className="admin-dashboard__today-card">
            <div className="admin-dashboard__today-icon">
              <FiDollarSign />
            </div>
            <div>
              <p className="admin-dashboard__today-label">Revenue</p>
              <p className="admin-dashboard__today-value">₹{stats.today.revenue.toLocaleString('en-IN')}</p>
            </div>
          </div>
          {/* Pending Count */}
          <div className="admin-dashboard__today-card">
            <div className="admin-dashboard__today-icon">
              <FiPackage />
            </div>
            <div>
              <p className="admin-dashboard__today-label">Pending</p>
              <p className="admin-dashboard__today-value">{stats.pendingOrders}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-dashboard__content">
        {/* Recent Orders Section */}
        <section className="admin-dashboard__section">
          <div className="admin-dashboard__section-header">
            <h3><FiPackage /> Recent Orders</h3>
            <Link to="/admin/orders" className="admin-dashboard__view-all">
              View All <FiArrowRight />
            </Link>
          </div>
          
          {/* Empty state or orders table */}
          {recentOrders.length === 0 ? (
            <div className="admin-dashboard__empty-state">
              <FiPackage size={40} />
              <p>No orders yet</p>
            </div>
          ) : (
            <div className="admin-dashboard__orders-table">
              {/* Table header */}
              <div className="admin-dashboard__table-header">
                <div className="admin-dashboard__col-id">Order ID</div>
                <div className="admin-dashboard__col-customer">Customer</div>
                <div className="admin-dashboard__col-amount">Amount</div>
                <div className="admin-dashboard__col-status">Status</div>
                <div className="admin-dashboard__col-date">Date</div>
              </div>
              {/* Order rows */}
              {recentOrders.map((order) => (
                <Link 
                  key={order._id} 
                  to={`/admin/orders/${order._id}`}
                  className="admin-dashboard__table-row"
                >
                  <div className="admin-dashboard__col-id">#{order._id.slice(-6).toUpperCase()}</div>
                  <div className="admin-dashboard__col-customer">
                    <div className="admin-dashboard__customer-name">{order.user?.name}</div>
                    <div className="admin-dashboard__customer-email">{order.user?.email}</div>
                  </div>
                  <div className="admin-dashboard__col-amount">₹{order.totalAmount?.toLocaleString('en-IN')}</div>
                  {/* Status badge with icon */}
                  <div className="admin-dashboard__col-status">
                    <span className={`admin-dashboard__status-badge admin-dashboard__status-badge--${order.orderStatus}`}>
                      {order.orderStatus === 'placed' && <FiPackage />}
                      {order.orderStatus === 'shipped' && <FiTruck />}
                      {order.orderStatus === 'delivered' && <FiCheckCircle />}
                      {order.orderStatus === 'cancelled' && <FiAlertCircle />}
                      {order.orderStatus}
                    </span>
                  </div>
                  <div className="admin-dashboard__col-date">{new Date(order.createdAt).toLocaleDateString()}</div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Low Stock Products Section */}
        <section className="admin-dashboard__section">
          <div className="admin-dashboard__section-header">
            <h3><FiAlertCircle /> Low Stock Alert</h3>
            <Link to="/admin/products" className="admin-dashboard__view-all">
              View All <FiArrowRight />
            </Link>
          </div>
          
          {/* Empty state or stock list */}
          {lowStockItems.length === 0 ? (
            <div className="admin-dashboard__empty-state">
              <FiCheckCircle size={40} />
              <p>All products have sufficient stock</p>
            </div>
          ) : (
            <div className="admin-dashboard__stock-list">
              {/* List low stock products */}
              {lowStockItems.map((product) => (
                <Link
                  key={product._id}
                  to={`/admin/products/${product.slug}/edit`}
                  className="admin-dashboard__stock-item"
                >
                  <div className="admin-dashboard__stock-product">
                    <img 
                      src={product.images?.[0] || '/placeholder.jpg'} 
                      alt={product.title}
                      className="admin-dashboard__stock-image"
                    />
                    <div className="admin-dashboard__stock-info">
                      <p className="admin-dashboard__stock-name">{product.title}</p>
                      <p className="admin-dashboard__stock-category">{product.category}</p>
                    </div>
                  </div>
                  {/* Stock count with status class */}
                  <div className={`admin-dashboard__stock-count ${(product.stock || 0) === 0 ? 'admin-dashboard__stock-count--out-of-stock' : 'admin-dashboard__stock-count--low-stock'}`}>
                    {product.stock || 0} left
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Quick Actions Grid */}
      <div className="admin-dashboard__quick-actions">
        <h3>Quick Actions</h3>
        <div className="admin-dashboard__actions-grid">
          <Link to="/admin/products/new" className="admin-dashboard__action-card">
            <FiShoppingBag size={24} />
            <span>Add Product</span>
          </Link>
          <Link to="/admin/orders" className="admin-dashboard__action-card">
            <FiPackage size={24} />
            <span>Manage Orders</span>
          </Link>
          <Link to="/admin/products" className="admin-dashboard__action-card">
            <FiShoppingCart size={24} />
            <span>View Products</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
