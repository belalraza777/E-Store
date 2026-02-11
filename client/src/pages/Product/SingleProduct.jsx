// SingleProduct.jsx - Individual product detail page with images, info and reviews
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useProductStore from '../../store/productStore.js'
import useReviewStore from '../../store/reviewStore.js'
import AddCartBtn from '../../components/FunctionalBtn/AddCartbtn.jsx'
import AddWishlistBtn from '../../components/FunctionalBtn/AddWishlistbtn.jsx'
import Sharebtn from '../../components/FunctionalBtn/Sharebtn.jsx'
import ReviewsSection from '../../components/reviews/ReviewsSection.jsx'
import Recommendation from '../../components/Recommendation/Recommendation.jsx'
import Skeleton from '../../components/ui/Skeleton/Skeleton.jsx'
import './SingleProduct.css'
import { toast } from 'sonner'


export default function SingleProduct() {
  // Get product slug from URL params
  const { slug } = useParams();

  // Get product and review data from stores
  const { currentProduct: product, loading: productLoading, fetchProductBySlug } = useProductStore();
  const { reviews, averageRating, totalReviews, loading: reviewsLoading, fetchProductReviews } = useReviewStore();

  // Local state for quantity selection
  const [quantity, setQuantity] = useState(1);
  // Track which image is selected in gallery
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
  if (productLoading) {
    return (
      <div className="single-product">
        <div className="single-product__loading" aria-busy="true">
          <Skeleton variant="circle" width="56px" height="56px" aria-label="Loading product" />
          <Skeleton variant="text" width="240px" />
          <Skeleton variant="text" width="180px" />
        </div>
      </div>
    );
  }
  // Show error if product not found
  if (!product) {
    return (
      <div className="single-product">
        <div className="single-product__error">
          <p>Product not found</p>
        </div>
      </div>
    );
  }

  // Calculate discount percentage if applicable
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;
  // Check stock availability
  const inStock = product.stock > 0;

  return (
    <div className="single-product">
      {/* Product Details Section */}
      <div className="single-product__details">
        {/* Product Images Gallery */}
        <div className="single-product__gallery">
          {/* Main selected image */}
          <div className="single-product__main-image">
            {product.images && product.images.length > 0 ? (
              <>
                <img
                  className="single-product__main-image-img"
                  src={product.images[selectedImage].url || product.images[selectedImage]}
                  alt={product.title}
                />
                {/* Discount badge overlay */}
                {hasDiscount && <div className="single-product__discount-badge">-{discountPercent}%</div>}
              </>
            ) : (
              <div className="single-product__placeholder">No Image Available</div>
            )}
          </div>

          {/* Thumbnail gallery - only show if multiple images */}
          {product.images && product.images.length > 1 && (
            <div className="single-product__thumbnails">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url || img}
                  alt={`${product.title} ${idx + 1}`}
                  className={`single-product__thumbnail ${selectedImage === idx ? 'single-product__thumbnail--active' : ''}`}
                  onClick={() => setSelectedImage(idx)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="single-product__info">
          {/* Category tag */}
          <div className="single-product__category">{product.category}</div>

          <h1 className="single-product__title">{product.title}</h1>

          {/* Rating display with stars */}
          <div className="single-product__rating">
            <div className="single-product__stars" aria-label={`Average rating ${averageRating.toFixed(1)} out of 5`}>
              {'★'.repeat(Math.round(averageRating))}
              <span className="single-product__stars-empty">{'☆'.repeat(5 - Math.round(averageRating))}</span>
            </div>
            <span className="single-product__rating-value">{averageRating.toFixed(1)}</span>
            <span className="single-product__reviews-link">({totalReviews} reviews)</span>
          </div>

          {/* Price display with discount if applicable */}
          <div className="single-product__price">
            <div className="single-product__price-display">
              {hasDiscount ? (
                <>
                  <span className="single-product__price-original">₹{product.price.toFixed(2)}</span>
                  <span className="single-product__price-current">₹{product.discountPrice.toFixed(2)}</span>
                </>
              ) : (
                <span className="single-product__price-current">₹{product.price.toFixed(2)}</span>
              )}
            </div>
            {hasDiscount && <div className="single-product__save-badge">Save {discountPercent}%</div>}
          </div>

          {/* Product description */}
          <p className="single-product__description">{product.description}</p>

          {/* Stock Status Indicator */}
          <div className={`single-product__stock ${inStock ? 'single-product__stock--in' : 'single-product__stock--out'}`}>
            <span className="single-product__stock-icon" aria-hidden="true">{inStock ? '✓' : '✕'}</span>
            {inStock ? `In Stock - ${product.stock} available` : 'Out of Stock'}
          </div>

          {/* Quantity Selector & Add to Cart Button */}
          {inStock && (
            <div className="single-product__actions">
              {/* Quantity controls */}
              <div className="single-product__qty">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="single-product__qty-btn"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max={product.stock}
                  className="single-product__qty-input"
                />
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="single-product__qty-btn"
                >
                  +
                </button>
              </div>
              {/* Add to cart and wishlist buttons */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <AddCartBtn productId={product._id} quantity={quantity} />
                <AddWishlistBtn productId={product._id} />
                <Sharebtn slug={product.slug} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations Section */}
      <Recommendation category={product.category} />

      {/* Reviews Section - displays and adds reviews */}
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
