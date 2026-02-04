// ProductList.jsx - Displays grid of product cards with loading and empty states
import React from 'react'
import ProductCard from './ProductCard.jsx'
import Skeleton from '../ui/Skeleton/Skeleton.jsx'
import './ProductList.css';

export default function ProductList({ products, loading = false, horizontal = false }) {

  // Show loading spinner while fetching products
  if (loading) {
    return (
      <div className="product-list-loading">
        <Skeleton variant="text" width="220px" aria-label="Loading products" />
        <div className="product-list-loading__grid" aria-hidden="true">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="product-list-loading__card">
              <Skeleton width="100%" height="180px" />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="55%" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Show empty state if no products found
  if (!products || products.length === 0) {
    return (
      <div className="product-list-empty">
        <svg 
          width="120" 
          height="120" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5"
          className="empty-icon"
        >
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
        <h3>No products found</h3>
        <p>Try adjusting your filters or check back later</p>
      </div>
    )
  }

  // Render grid of product cards
  return (
    <div className={`product-list ${horizontal ? 'product-list--horizontal' : ''}`}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}
