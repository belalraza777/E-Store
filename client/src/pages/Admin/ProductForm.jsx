import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import useProductStore from '../../store/productStore.js';
// Styles loaded via main.css

export default function ProductForm() {
  const { slug } = useParams();
  const isEdit = Boolean(slug);
  const navigate = useNavigate();

  const {
    currentProduct,
    fetchProductBySlug,
    fetchCategories,
    categories,
    createProduct,
    updateProduct,
    loading,
  } = useProductStore();

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    discountPrice: '',
    stock: '',
    category: '',
    isActive: true,
  });
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (isEdit && slug) {
      fetchProductBySlug(slug);
    }
  }, [isEdit, slug, fetchProductBySlug]);

  useEffect(() => {
    if (isEdit && currentProduct) {
      setForm({
        title: currentProduct.title || '',
        description: currentProduct.description || '',
        price: currentProduct.price ?? '',
        discountPrice: currentProduct.discountPrice ?? '',
        stock: currentProduct.stock ?? '',
        category: currentProduct.category || '',
        isActive: currentProduct.isActive !== false,
      });
    }
  }, [isEdit, currentProduct]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!form.title || !form.description || !form.price || !form.category) {
      toast.error('Please fill required fields');
      return;
    }

    const fd = new FormData();
    fd.append('title', form.title.trim());
    fd.append('description', form.description.trim());
    fd.append('price', Number(form.price));
    if (form.discountPrice !== '') fd.append('discountPrice', Number(form.discountPrice));
    if (form.stock !== '') fd.append('stock', Number(form.stock));
    fd.append('category', form.category);
    fd.append('isActive', form.isActive);
    images.forEach((file) => fd.append('images', file));

    setSubmitting(true);
    let result;
    if (isEdit && currentProduct?._id) {
      result = await updateProduct(currentProduct._id, fd);
    } else {
      result = await createProduct(fd);
    }
    setSubmitting(false);

    if (result.success) {
      toast.success(isEdit ? 'Product updated' : 'Product created');
      navigate('/admin/products');
    } else {
      toast.error(result.message || 'Operation failed');
    }
  };

  return (
    <div className="admin-product-form-page">
      <div className="header">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>{isEdit ? 'Edit Product' : 'Add Product'}</h1>
          <p className="subtext">{isEdit ? 'Update product details' : 'Create a new catalog item'}</p>
        </div>
        <div className="header-actions">
          <Link to="/admin/products" className="ghost">Back</Link>
        </div>
      </div>

      <form className="product-form" onSubmit={handleSubmit}>
        <div className="grid">
          <label className="field">
            <span>Title *</span>
            <input name="title" value={form.title} onChange={handleChange} placeholder="Product title" required />
          </label>

          <label className="field">
            <span>Price *</span>
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
          </label>

          <label className="field">
            <span>Discount Price</span>
            <input
              name="discountPrice"
              type="number"
              min="0"
              step="0.01"
              value={form.discountPrice}
              onChange={handleChange}
              placeholder="0.00"
            />
          </label>

          <label className="field">
            <span>Stock</span>
            <input
              name="stock"
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={handleChange}
              placeholder="0"
            />
          </label>

          <label className="field">
            <span>Category *</span>
            <select name="category" value={form.category} onChange={handleChange} required>
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>

          <label className="field checkbox">
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
            <span>Active (visible)</span>
          </label>
        </div>

        <label className="field">
          <span>Description *</span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Product description"
            required
          />
        </label>

        <label className="field">
          <span>Images (optional, uploads will replace existing)</span>
          <input type="file" accept="image/*" multiple onChange={handleImages} />
          {isEdit && currentProduct?.images?.length > 0 && (
            <div className="thumbs">
              {currentProduct.images.map((img, idx) => (
                <img key={idx} src={img.url} alt={`img-${idx}`} />
              ))}
            </div>
          )}
        </label>

        <div className="form-actions">
          <button type="submit" disabled={submitting || loading} className="primary">
            {submitting ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Product' : 'Create Product')}
          </button>
          <button type="button" className="ghost" onClick={() => navigate('/admin/products')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
