// Dashboard.jsx - Admin dashboard with stats, recent orders, and low stock alerts
import './Dashboard.css';
import React, { useEffect, useCallback, useMemo } from 'react';
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
import useOrderStore from '../../../../store/orderStore.js';
import useProductStore from '../../../../store/productStore.js';
import Skeleton from '../../../../components/ui/Skeleton/Skeleton.jsx';

import {
  calculateTotalRevenue,
  calculateTodayStats,
  calculatePendingOrders,
  calculateLowStockProducts,
  getRecentOrders,
  getLowStockProducts
} from '../../../../helper/adminStatsHelper.js';

// --- Local helper functions for stats calculations ---
function getStats(orders, products) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const todayOrders = orders.filter(o => new Date(o.createdAt) >= today);
  const todayRevenue = todayOrders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const yesterdayOrders = orders.filter(o => {
    const orderDate = new Date(o.createdAt);
    return orderDate >= yesterday && orderDate < today;
  });
  const yesterdayRevenue = yesterdayOrders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const revenueGrowth = yesterdayRevenue > 0 ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 : 0;
  return {
    revenue: calculateTotalRevenue(orders),
    totalOrders: orders.length,
    totalProducts: products.length,
    pendingOrders: calculatePendingOrders(orders),
    lowStockProducts: calculateLowStockProducts(products),
    today: calculateTodayStats(orders),
    revenueGrowth,
  };
}
function getRecentOrdersMemo(orders) {
  return getRecentOrders(orders, 5);
}
function getLowStockItemsMemo(products) {
  return getLowStockProducts(products, 10, 5);
}

import StatsGrid from './StatsGrid.jsx';
import TodayStats from './TodayStats.jsx';
import RecentOrders from './RecentOrders.jsx';
import LowStockAlert from './LowStockAlert.jsx';
import QuickActions from './QuickActions.jsx';

function AdminDashboard() {
  // Get orders and products data from stores
  const { orders, loading: ordersLoading, fetchAllOrders } = useOrderStore();
  const { products, loading: productsLoading, fetchProducts } = useProductStore();

  // Fetch all orders and products on mount (stable callback)
  const loadData = useCallback(async () => {
    await fetchAllOrders();
    await fetchProducts({ page: 1, limit: 100 });
  }, [fetchAllOrders, fetchProducts]);

  useEffect(() => {
    loadData();
  }, [loadData]);


  // Compute stats and lists using helpers for clarity
  const stats = useMemo(() => getStats(orders, products), [orders, products]);
  const recentOrders = useMemo(() => getRecentOrdersMemo(orders), [orders]);
  const lowStockItems = useMemo(() => getLowStockItemsMemo(products), [products]);

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

      <StatsGrid stats={stats} />
      <TodayStats stats={stats} />

      <div className="admin-dashboard__content">
        <RecentOrders recentOrders={recentOrders} />
        <LowStockAlert lowStockItems={lowStockItems} />
      </div>

      <QuickActions />
    </div>
  );
}

export default React.memo(AdminDashboard);
