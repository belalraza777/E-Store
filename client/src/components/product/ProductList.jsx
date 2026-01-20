import React from 'react'
import ProductCard from './ProductCard.jsx'
import './ProductList.css'

export default function ProductList({ products, loading = false }) {

  if (loading) {
    return (
      <div className="product-list-loading">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    )
  }

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

  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}
