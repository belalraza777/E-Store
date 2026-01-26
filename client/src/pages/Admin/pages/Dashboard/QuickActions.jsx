import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiPackage, FiShoppingCart } from 'react-icons/fi';

export default function QuickActions() {
  return (
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
  );
}
