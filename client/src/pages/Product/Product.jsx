// Product.jsx - Products listing page with infinite scroll
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import useProductStore from '../../store/productStore.js'
import ProductList from '../../components/product/ProductList.jsx'
// Styles loaded via main.css
import { Link } from 'react-router-dom'

export default function Product() {
  // Get products fetching function from store
  const { fetchProducts } = useProductStore();
  
  // Local state for product list and pagination
  const [allProducts, setAllProducts] = useState([]);
  // Current page number
  const [page, setPage] = useState(1);
  // Total pages available
  const [totalPages, setTotalPages] = useState(0);
  // Whether more pages exist
  const [hasMore, setHasMore] = useState(true);
  // Loading state for initial load
  const [loading, setLoading] = useState(true);

  // Load first page when component mounts
  useEffect(() => {
    loadFirstPage();
  }, []);

  // Fetch first page of products
  const loadFirstPage = async () => {
    setLoading(true);
    const result = await fetchProducts({ page: 1 });
    if (result.success) {
      // Set products and pagination info
      setAllProducts(result.data);
      setTotalPages(result.pagination.totalPages);
      setPage(1);
      setHasMore(result.pagination.totalPages > 1);
    }
    setLoading(false);
  };

  // Infinite scroll - fetch next page and append to list
  const fetchMore = async () => {
    const nextPage = page + 1;
    const result = await fetchProducts({ page: nextPage });
    if (result.success) {
      // Append new products to existing list
      setAllProducts(prev => [...prev, ...result.data]);
      setPage(nextPage);
      // Check if more pages available
      setHasMore(nextPage < totalPages);
    }
  };

  return (
    <div className="product-page">
      <h1>Products</h1>
      
      {/* Infinite scroll wrapper - auto loads more on scroll */}
      <InfiniteScroll
        dataLength={allProducts.length}
        next={fetchMore}
        hasMore={hasMore}
        loader={<div className="loader">Loading more...</div>}
        endMessage={<div className="end-message">No more products</div>}
      >
        {/* Product grid - shows loading only on first page */}
        <ProductList products={allProducts} loading={loading && page === 1} />
      </InfiniteScroll>
    </div>
  )
}
