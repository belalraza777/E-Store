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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(true);
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
      setAllProducts(result.data);
      setTotalPages(result.pagination.totalPages);
      setPage(1);
      setHasMore(result.pagination.totalPages > 1);
    }
    setLoading(false);
  };
// Infinite scroll - fetch next page
  
  const fetchMore = async () => {
    const nextPage = page + 1;
    const result = await fetchProducts({ page: nextPage });
    if (result.success) {
      setAllProducts(prev => [...prev, ...result.data]);
      setPage(nextPage);
      setHasMore(nextPage < totalPages);
    }
  };

  return (
    <div className="product-page">
      <h1>Products</h1>
      
      <InfiniteScroll
        dataLength={allProducts.length}
        next={fetchMore}
        hasMore={hasMore}
        loader={<div className="loader">Loading more...</div>}
        endMessage={<div className="end-message">No more products</div>}
      >
        <ProductList products={allProducts} loading={loading && page === 1} />
      </InfiniteScroll>
    </div>
  )
}
