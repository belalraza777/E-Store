import React, { useState } from 'react'
import AddCartBtn from '../FunctionalBtn/AddCartbtn.jsx'
import './ProductCard.css'
import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
    const [quantity, setQuantity] = useState(1);

    if (!product || !product.isActive) return null;

    const hasDiscount = product.discountPrice && product.discountPrice < product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : 0;
    const inStock = product.stock > 0;

    return (
        <div className="product-card">
            <Link to={`/products/${product.slug}`}>
                {/* Image Container */}
                <div className="product-image-container">
                    {product.images && product.images.length > 0 ? (
                        <img
                            src={product.images[0].url}
                            alt={product.title}
                            className="product-image"
                        />
                    ) : (
                        <div className="product-placeholder">No Image</div>
                    )}

                    {/* Discount Badge */}
                    {hasDiscount && (
                        <div className="discount-badge">-{discountPercent}%</div>
                    )}

                    {/* Stock Badge */}
                    <div className={`stock-badge ${inStock ? 'in-stock' : 'out-of-stock'}`}>
                        {inStock ? 'In Stock' : 'Out of Stock'}
                    </div>
                </div>
            </Link>
            {/* Product Info */}
            <div className="product-info">
                {/* Category */}
                <p className="product-category">{product.category}</p>

                {/* Title */}
                <h3 className="product-title">{product.title}</h3>

                {/* Rating & Reviews */}
                <div className="product-rating">
                    <span className="stars">★</span>
                    <span className="rating-value">{product.averageRating || 0}</span>
                    <span className="review-count">({product.reviewCount || 0} reviews)</span>
                </div>

                {/* Price */}
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

                {/* Quantity & Add to Cart */}
                <div className="product-actions">
                    <div className="quantity-selector">
                        <button
                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            className="qty-btn"
                        >
                            -
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
                            className="qty-btn"
                        >
                            +
                        </button>
                    </div>

                    <AddCartBtn productId={product._id} quantity={quantity} />
                </div>
            </div>
        </div>
    )
}
