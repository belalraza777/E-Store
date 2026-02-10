// ProductCard.jsx - Displays single product with image, price, and add to cart
import React, { useState } from 'react'
import AddCartBtn from '../FunctionalBtn/AddCartbtn.jsx'
import './ProductCard.css';
import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
    // Track quantity for add to cart
    const [quantity, setQuantity] = useState(1);

    // Don't render if product is invalid or inactive
    if (!product || !product.isActive) return null;

    // Calculate discount info
    const hasDiscount = product.discountPrice && product.discountPrice < product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : 0;
    const inStock = product.stock > 0;

    return (
        <div className="product-card">
            {/* Clickable image area - links to product detail */}
            <Link to={`/products/${product.slug}`}>
                <div className="product-image-container">
                    {/* Product image or placeholder */}
                    {product.images && product.images.length > 0 ? (
                        <img
                            src={product.images[0]?.url || product.images[0]}
                            alt={product.title}
                            className="product-image"
                            lazy="true"
                        />
                    ) : (
                        <div className="product-placeholder">No Image</div>
                    )}

                    {/* Discount badge - shows percentage off */}
                    {hasDiscount && (
                        <div className="discount-badge">-{discountPercent}%</div>
                    )}

                    {/* Stock status badge */}
                    <div className={`stock-badge ${inStock ? 'in-stock' : 'out-of-stock'}`}>
                        {inStock ? 'In Stock' : 'Out of Stock'}
                    </div>
                </div>
            </Link>

            {/* Product details section */}
            <div className="product-info">
                {/* Category label */}
                <p className="product-category">{product.category}</p>

                {/* Product title */}
                <h3 className="product-title">{product.title}</h3>

                {/* Rating and review count */}
                <div className="product-rating">
                    <span className="stars">★</span>
                    <span className="rating-value">{product.averageRating || 0}</span>
                    <span className="review-count">({product.reviewCount || 0} reviews)</span>
                </div>

                {/* Price display - original and discounted */}
                <div className="product-price">
                    {hasDiscount ? (
                        <>
                            <span className="original-price">₹{product.price.toFixed(2)}</span>
                            <span className="discount-price">₹{product.discountPrice.toFixed(2)}</span>
                        </>
                    ) : (
                        <span className="current-price">₹{product.price.toFixed(2)}</span>
                    )}
                </div>

                {/* Quantity selector and add to cart button */}
                {inStock && (
                <div className="product-actions">
                    <div className="quantity-selector">
                        {/* Decrease quantity button */}
                        <button
                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            className="qty-btn"
                        >
                            -
                        </button>
                        {/* Quantity input */}
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            min="1"
                            max={product.stock}
                            className="qty-input"
                        />
                        {/* Increase quantity button */}
                        <button
                            onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                            className="qty-btn"
                        >
                            +
                        </button>
                    </div>

                    {/* Add to cart button component */}
                    <AddCartBtn productId={product._id} quantity={quantity} />
                </div>
                )}
            </div>
        </div>
    )
}
