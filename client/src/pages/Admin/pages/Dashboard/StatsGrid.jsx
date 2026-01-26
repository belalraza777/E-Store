import React from 'react';
import { FiDollarSign, FiShoppingCart, FiShoppingBag, FiClock, FiTrendingUp, FiTrendingDown, FiAlertCircle } from 'react-icons/fi';

export default function StatsGrid({ stats }) {
  return (
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
  );
}
