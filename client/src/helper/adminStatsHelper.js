/**
 * Helper functions to calculate admin dashboard statistics
 * Keeps Dashboard component clean and reusable
 */

/**
 * Calculate total revenue from paid orders
 */
export const calculateTotalRevenue = (orders = []) => {
  return orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
};

/**
 * Calculate today's performance stats
 */
export const calculateTodayStats = (orders = []) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayOrders = orders.filter(o => new Date(o.createdAt) >= today);
  const todayRevenue = todayOrders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return {
    orders: todayOrders.length,
    revenue: todayRevenue,
  };
};

/**
 * Count pending orders (placed or shipped, not delivered/cancelled)
 */
export const calculatePendingOrders = (orders = []) => {
  return orders.filter(o => 
    o.orderStatus === 'placed' || o.orderStatus === 'shipped'
  ).length;
};

/**
 * Count products with low stock (< 10 units)
 */
export const calculateLowStockProducts = (products = []) => {
  return products.filter(p => (p.stock || 0) < 10).length;
};

/**
 * Get recent orders sorted by creation date
 * @param {Array} orders - Array of orders
 * @param {Number} limit - Number of recent orders to return (default: 5)
 */
export const getRecentOrders = (orders = [], limit = 5) => {
  return [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);
};

/**
 * Get low stock products (stock < 10)
 */
export const getLowStockProducts = (products = []) => {
  return products
    .filter(p => (p.stock || 0) < 10)
    .sort((a, b) => (a.stock || 0) - (b.stock || 0))
    .slice(0, 5);
};

/**
 * Get order status summary
 */
export const getOrderStatusSummary = (orders = []) => {
  return {
    total: orders.length,
    placed: orders.filter(o => o.orderStatus === 'placed').length,
    shipped: orders.filter(o => o.orderStatus === 'shipped').length,
    delivered: orders.filter(o => o.orderStatus === 'delivered').length,
    cancelled: orders.filter(o => o.orderStatus === 'cancelled').length,
  };
};

/**
 * Get payment status summary
 */
export const getPaymentStatusSummary = (orders = []) => {
  return {
    total: orders.length,
    paid: orders.filter(o => o.paymentStatus === 'paid').length,
    pending: orders.filter(o => o.paymentStatus === 'pending').length,
    failed: orders.filter(o => o.paymentStatus === 'failed').length,
  };
};

/**
 * Get stats grouped by day (last 30 days)
 */
export const getDailyStats = (orders = []) => {
  const stats = {};
  
  orders.forEach(order => {
    const date = new Date(order.createdAt).toLocaleDateString('en-IN');
    if (!stats[date]) {
      stats[date] = { orders: 0, revenue: 0 };
    }
    stats[date].orders++;
    if (order.paymentStatus === 'paid') {
      stats[date].revenue += order.totalAmount || 0;
    }
  });

  return Object.entries(stats).map(([date, data]) => ({
    date,
    ...data,
  }));
};

/**
 * Get stats grouped by month (last 12 months)
 */
export const getMonthlyStats = (orders = []) => {
  const stats = {};
  
  orders.forEach(order => {
    const date = new Date(order.createdAt);
    const month = date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
    if (!stats[month]) {
      stats[month] = { orders: 0, revenue: 0 };
    }
    stats[month].orders++;
    if (order.paymentStatus === 'paid') {
      stats[month].revenue += order.totalAmount || 0;
    }
  });

  return Object.entries(stats).map(([month, data]) => ({
    month,
    ...data,
  }));
};

/**
 * Get stats grouped by year
 */
export const getYearlyStats = (orders = []) => {
  const stats = {};
  
  orders.forEach(order => {
    const year = new Date(order.createdAt).getFullYear().toString();
    if (!stats[year]) {
      stats[year] = { orders: 0, revenue: 0 };
    }
    stats[year].orders++;
    if (order.paymentStatus === 'paid') {
      stats[year].revenue += order.totalAmount || 0;
    }
  });

  return Object.entries(stats).map(([year, data]) => ({
    year,
    ...data,
  }));
};
