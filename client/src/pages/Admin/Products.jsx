import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import useProductStore from '../../store/productStore.js';
import './AdminProducts.css';

export default function AdminProducts() {
  const { products, loading, fetchProducts, deleteProduct, updateStock } = useProductStore();
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const result = await fetchProducts({ page: 1, limit: 50 });
    if (!result.success) {
      toast.error(result.message || 'Failed to load products');
    }
  };

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

  const handleStockUpdate = async (id, name, currentStock) => {
    const input = prompt(`Update stock for ${name}`, currentStock ?? 0);
    if (input === null) return;
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
      <div className="admin-products-header">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Products</h1>
          <p className="subtext">Manage catalog, pricing, and stock</p>
        </div>
        <div className="actions">
          <Link className="primary" to="/admin/products/new">Add Product</Link>
          <button className="ghost" onClick={loadProducts} disabled={loading}>Refresh</button>
        </div>
      </div>

      {loading && products.length === 0 ? (
        <div className="loading-box">Loading products...</div>
      ) : (
        <div className="table-card">
          <div className="table-head">
            <span>Name</span>
            <span>Price</span>
            <span>Discount</span>
            <span>Stock</span>
            <span>Category</span>
            <span>Actions</span>
          </div>
          {products.length === 0 && (
            <div className="empty">No products found.</div>
          )}
          {products.map((p) => (
            <div key={p._id} className="table-row">
              <div className="prod-main">
                {p.image ? (
                  <img src={p.image} alt={p.name} />
                ) : (
                  <div className="img-ph">NA</div>
                )}
                <div>
                  <div className="name">{p.name}</div>
                  <div className="sku">{p.slug || p._id?.slice(0,8)}</div>
                </div>
              </div>
              <div>₹{p.price?.toFixed?.(2) || p.price}</div>
              <div className={p.discountPrice ? 'discount' : 'muted'}>
                {p.discountPrice ? `₹${p.discountPrice.toFixed?.(2)}` : '—'}
              </div>
              <div className={p.stock === 0 ? 'danger' : ''}>{p.stock ?? '—'}</div>
              <div className="muted">{p.category || '—'}</div>
              <div className="row-actions">
                <Link className="secondary" to={`/admin/products/${p.slug}/edit`}>Edit</Link>
                <button 
                  className="secondary"
                  onClick={() => handleStockUpdate(p._id, p.name, p.stock)}
                  disabled={updatingId === p._id || loading}
                >
                  {updatingId === p._id ? 'Updating...' : 'Stock'}
                </button>
                <button 
                  className="danger"
                  onClick={() => handleDelete(p._id, p.name)}
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
