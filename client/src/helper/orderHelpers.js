// Helper function to compute order status counts for dashboard stats
export function computeStats(orders = []) {
  return {
    total: orders.length,
    placed: orders.filter(o => o.orderStatus === 'placed').length,
    shipped: orders.filter(o => o.orderStatus === 'shipped').length,
    delivered: orders.filter(o => o.orderStatus === 'delivered').length,
  };
}

// Helper function to extract unique cities from orders for filtering
export function getUniqueCities(orders = []) {
  return Array.from(new Set(orders.map(o => o.shippingAddress?.city).filter(Boolean)));
}

// Helper function to check if an order matches the search term
export function matchesSearch(order, searchTerm = '') {
  if (!searchTerm) return true;
  const q = searchTerm.toLowerCase();
  return (
    order.user?.name?.toLowerCase().includes(q) ||
    order.user?.email?.toLowerCase().includes(q) ||
    order._id?.toLowerCase().includes(q)
  );
}

// Main filtering function for orders based on status, search term, and city
export function filterOrders(orders = [], { filterStatus = '', searchTerm = '', cityFilter = '' } = {}) {
  return orders.filter(order => {
    const matchesStatus = !filterStatus || order.orderStatus === filterStatus;
    const matchesCity = !cityFilter || order.shippingAddress?.city === cityFilter;
    const matchesSearchTerm = matchesSearch(order, searchTerm);
    return matchesStatus && matchesCity && matchesSearchTerm;
  });
}
