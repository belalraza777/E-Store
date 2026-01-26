import React from 'react';
import { FiShoppingCart, FiDollarSign, FiPackage } from 'react-icons/fi';

export default function TodayStats({ stats }) {
  return (
    <div className="admin-dashboard__today-stats">
      <div className="admin-dashboard__section-header">
        <h3>Today's Performance</h3>
      </div>
      <div className="admin-dashboard__today-grid">
        <div className="admin-dashboard__today-card">
          <div className="admin-dashboard__today-icon">
            <FiShoppingCart />
          </div>
          <div>
            <p className="admin-dashboard__today-label">Orders</p>
            <p className="admin-dashboard__today-value">{stats.today.orders}</p>
          </div>
        </div>
        <div className="admin-dashboard__today-card">
          <div className="admin-dashboard__today-icon">
            <FiDollarSign />
          </div>
          <div>
            <p className="admin-dashboard__today-label">Revenue</p>
            <p className="admin-dashboard__today-value">₹{stats.today.revenue.toLocaleString('en-IN')}</p>
          </div>
        </div>
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
  );
}
