import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertCircle, FiCheckCircle, FiArrowRight } from 'react-icons/fi';

export default function LowStockAlert({ lowStockItems }) {
  return (
    <section className="admin-dashboard__section">
      <div className="admin-dashboard__section-header">
        <h3><FiAlertCircle /> Low Stock Alert</h3>
        <Link to="/admin/products" className="admin-dashboard__view-all">
          View All <FiArrowRight />
        </Link>
      </div>
      {lowStockItems.length === 0 ? (
        <div className="admin-dashboard__empty-state">
          <FiCheckCircle size={40} />
          <p>All products have sufficient stock</p>
        </div>
      ) : (
        <div className="admin-dashboard__stock-list">
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
              <div className={`admin-dashboard__stock-count ${(product.stock || 0) === 0 ? 'admin-dashboard__stock-count--out-of-stock' : 'admin-dashboard__stock-count--low-stock'}`}>
                {product.stock || 0} left
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
