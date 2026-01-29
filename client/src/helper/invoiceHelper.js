// invoiceHelper.js - Shared helper to extract invoice data from order object
// Usage: getInvoiceData(order) returns the data object for generateCustomerInvoice

export function getInvoiceData(order) {
  if (!order) return null;
  return {
    storeName: 'E-Store',
    // storeLogo: '', // Optionally add base64 logo here
    invoiceNumber: order.invoiceNumber || order._id.slice(-8).toUpperCase(),
    orderId: order._id,
    customerName: order.shippingAddress?.name || order.user?.name || '',
    customerEmail: order.shippingAddress?.email || order.user?.email || '',
    products: order.items.map(item => ({
      name: item.product?.title || 'Product',
      quantity: item.quantity,
      price: Number(item.discount || item.price)
    })),
    subtotal: order.subtotal || order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    total: order.totalAmount,
    paymentMethod: order.paymentMethod,
    orderDate: order.createdAt
  };
}