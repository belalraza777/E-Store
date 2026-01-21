// Products.jsx - Admin product management page with CRUD operations
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import './Products.css'; // Importing component-scoped styles
import useProductStore from '../../store/productStore.js';
// Styles loaded via main.css

export default function AdminProducts() {
  // Get product data and actions from store
  const { products, loading, fetchProducts, deleteProduct, updateStock } = useProductStore();
  // Track which product is being updated
  const [updatingId, setUpdatingId] = useState(null);

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Fetch products from API
  const loadProducts = async () => {
    const result = await fetchProducts({ page: 1, limit: 50 });
    if (!result.success) {
      toast.error(result.message || 'Failed to load products');
    }
  };

  // Handle product deletion with confirmation
  const handleDelete = async (id, name) => {
    if (!confirm(`Delete product "${name}"?`)) return;
    const res = await deleteProduct(id);
    if (res.success) {
      toast.success('Product deleted');
      await loadProducts();
    } else {
      toast.error(res.message || 'Failed to delete');
    }
  };

  // Handle stock update via prompt
  const handleStockUpdate = async (id, name, currentStock) => {
    const input = prompt(`Update stock for ${name}`, currentStock ?? 0);
    if (input === null) return;
    // Validate stock input
    const stock = parseInt(input, 10);
    if (Number.isNaN(stock) || stock < 0) {
      toast.error('Invalid stock value');
      return;
    }
    setUpdatingId(id);
    const res = await updateStock(id, stock);
    setUpdatingId(null);
    if (res.success) {
      toast.success('Stock updated');
      await loadProducts();
    } else {
      toast.error(res.message || 'Failed to update stock');
    }
  };

  return (
    <div className="admin-products-page">
      {/* Page Header */}
      <div className="admin-products-page__header">
        <div>
          <p className="admin-products-page__eyebrow">Admin</p>
          <h1>Products</h1>
          <p className="admin-products-page__subtext">Manage catalog, pricing, and stock</p>
        </div>
        {/* Action buttons */}
        <div className="admin-products-page__actions">
          <Link className="admin-products-page__btn admin-products-page__btn--primary" to="/admin/products/new">Add Product</Link>
          <button className="admin-products-page__btn admin-products-page__btn--ghost" onClick={loadProducts} disabled={loading}>Refresh</button>
        </div>
      </div>

      {/* Loading state or products table */}
      {loading && products.length === 0 ? (
        <div className="admin-products-page__loading">Loading products...</div>
      ) : (
        <div className="admin-products-page__table-card">
          {/* Table header */}
          <div className="admin-products-page__table-head">
            <span>Name</span>
            <span>Price</span>
            <span>Discount</span>
            <span>Stock</span>
            <span>Category</span>
            <span>Actions</span>
          </div>
          {/* Empty state */}
          {products.length === 0 && (
            <div className="admin-products-page__empty">No products found.</div>
          )}
          {/* Product rows */}
          {products.map((p) => (
            <div key={p._id} className="admin-products-page__table-row">
              {/* Product name with image */}
              <div className="admin-products-page__prod-main">
                {p.images?.[0]?.url || p.images?.[0] ? (
                  <img src={p.images[0]?.url || p.images[0]} alt={p.title} />
                ) : (
                  <div className="admin-products-page__img-placeholder">NA</div>
                )}
                <div>
                  <div className="admin-products-page__name">{p.title}</div>
                  <div className="admin-products-page__sku">{p.slug || p._id?.slice(0,8)}</div>
                </div>
              </div>
              {/* Price column */}
              <div>₹{p.price?.toFixed?.(2) || p.price}</div>
              {/* Discount price column */}
              <div className={p.discountPrice ? 'admin-products-page__discount' : 'admin-products-page__muted'}>
                {p.discountPrice ? `₹${p.discountPrice.toFixed?.(2)}` : '—'}
              </div>
              {/* Stock column - danger style if 0 */}
              <div className={p.stock === 0 ? 'admin-products-page__danger' : ''}>{p.stock ?? '—'}</div>
              {/* Category column */}
              <div className="admin-products-page__muted">{p.category || '—'}</div>
              {/* Action buttons */}
              <div className="admin-products-page__row-actions">
                <Link className="admin-products-page__row-btn admin-products-page__row-btn--secondary" to={`/admin/products/${p.slug}/edit`}>Edit</Link>
                <button 
                  className="admin-products-page__row-btn admin-products-page__row-btn--secondary"
                  onClick={() => handleStockUpdate(p._id, p.title, p.stock)}
                  disabled={updatingId === p._id || loading}
                >
                  {updatingId === p._id ? 'Updating...' : 'Stock'}
                </button>
                <button 
                  className="admin-products-page__row-btn admin-products-page__row-btn--danger"
                  onClick={() => handleDelete(p._id, p.title)}
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
