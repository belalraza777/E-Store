import React from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiTruck, FiCheckCircle, FiAlertCircle, FiArrowRight } from 'react-icons/fi';

export default function RecentOrders({ recentOrders }) {
  return (
    <section className="admin-dashboard__section">
      <div className="admin-dashboard__section-header">
        <h3><FiPackage /> Recent Orders</h3>
        <Link to="/admin/orders" className="admin-dashboard__view-all">
          View All <FiArrowRight />
        </Link>
      </div>
      {recentOrders.length === 0 ? (
        <div className="admin-dashboard__empty-state">
          <FiPackage size={40} />
          <p>No orders yet</p>
        </div>
      ) : (
        <div className="admin-dashboard__orders-table">
          <div className="admin-dashboard__table-header">
            <div className="admin-dashboard__col-id">Order ID</div>
            <div className="admin-dashboard__col-customer">Customer</div>
            <div className="admin-dashboard__col-amount">Amount</div>
            <div className="admin-dashboard__col-status">Status</div>
            <div className="admin-dashboard__col-date">Date</div>
          </div>
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
  );
}
