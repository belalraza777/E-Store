import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useProductStore from '../../store/productStore.js'
import useReviewStore from '../../store/reviewStore.js'
import AddCartBtn from '../../components/FunctionalBtn/AddCartbtn.jsx'
import ReviewsSection from '../../components/reviews/ReviewsSection.jsx'
// Styles loaded via main.css

export default function SingleProduct() {
  // Get product slug from URL
  const { slug } = useParams();
  
  // Get product and review data from stores
  const { currentProduct: product, loading: productLoading, fetchProductBySlug } = useProductStore();
  const { reviews, averageRating, totalReviews, loading: reviewsLoading, fetchProductReviews } = useReviewStore();
  
  // Local state for quantity and image selection
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Fetch product when slug changes
  useEffect(() => {
    if (slug) {
      fetchProductBySlug(slug);
    }
  }, [slug]);

  // Fetch reviews when product loads
  useEffect(() => {
    if (product?._id) {
      fetchProductReviews(product._id);
    }
  }, [product?._id]);

  // Show loading state
  if (productLoading) return <div className="loading-container"><div className="spinner-large"></div><p>Loading product...</p></div>;
  if (!product) return <div className="error-container"><p>❌ Product not found</p></div>;

  // Calculate discount details

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;
  const inStock = product.stock > 0;

  return (
    <div className="single-product">
      {/* Product Details */}
      <div className="product-details">
        {/* Images */}
        <div className="product-images">
          <div className="main-image">
            {product.images && product.images.length > 0 ? (
              <>
                <img src={product.images[selectedImage].url} alt={product.title} />
                {hasDiscount && <div className="discount-badge">-{discountPercent}%</div>}
              </>
            ) : (
              <div className="placeholder">No Image Available</div>
            )}
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="thumbnail-images">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={`${product.title} ${idx + 1}`}
                  className={`thumbnail ${selectedImage === idx ? 'active' : ''}`}
                  onClick={() => setSelectedImage(idx)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="product-info">
          <div className="category-badge">{product.category}</div>

          <h1 className="product-title">{product.title}</h1>

          <div className="rating-section">
            <div className="stars-display">
              {'★'.repeat(Math.round(averageRating))}<span className="empty-stars">{'☆'.repeat(5 - Math.round(averageRating))}</span>
            </div>
            <span className="rating-value">{averageRating.toFixed(1)}</span>
            <span className="reviews-link">({totalReviews} reviews)</span>
          </div>

          <div className="price-section">
            <div className="price-display">
              {hasDiscount ? (
                <>
                  <span className="original-price">₹{product.price.toFixed(2)}</span>
                  <span className="current-price">₹{product.discountPrice.toFixed(2)}</span>
                </>
              ) : (
                <span className="current-price">₹{product.price.toFixed(2)}</span>
              )}
            </div>
            {hasDiscount && <div className="save-badge">Save {discountPercent}%</div>}
          </div>

          <p className="description">{product.description}</p>

          {/* Stock Status */}
          <div className={`stock-status ${inStock ? 'in-stock' : 'out-of-stock'}`}>
            <span className="status-icon">{inStock ? '✓' : '✕'}</span>
            {inStock ? `In Stock - ${product.stock} available` : 'Out of Stock'}
          </div>

          {/* Quantity & Add to Cart */}
          <div className="actions">
            <div className="quantity-selector">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="qty-btn qty-minus"
              >
                −
              </button>
              <input 
                type="number" 
                value={quantity} 
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max={product.stock}
                className="qty-input"
              />
              <button 
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                className="qty-btn qty-plus"
              >
                +
              </button>
            </div>
            <AddCartBtn productId={product._id} quantity={quantity} />
          </div>
        </div>
      </div>

      {/* Reviews Section Component */}
      <ReviewsSection 
        productId={product._id}
        reviews={reviews}
        averageRating={averageRating}
        totalReviews={totalReviews}
        reviewsLoading={reviewsLoading}
        fetchProductReviews={fetchProductReviews}
      />
    </div>
  )
}
