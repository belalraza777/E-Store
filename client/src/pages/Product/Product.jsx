
// Product page with infinite scroll, category filter, and skeleton loading
import React, { useEffect, useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import useProductStore from '../../store/productStore.js'
import ProductList from '../../components/product/ProductList.jsx'
import CategoryButtons from '../../components/product/CategoryButtons.jsx'
import './Product.css'
import Skeleton from '../../components/ui/Skeleton/Skeleton.jsx'



export default function Product() {
  const fetchProducts = useProductStore(state => state.fetchProducts)

  // State for all loaded products
  const [allProducts, setAllProducts] = useState([])
  // State for current selected category
  const [currentCategory, setCurrentCategory] = useState('all')
  // Pagination states
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  // Loading state
  const [loading, setLoading] = useState(false)

  const loadingRef = useRef(false)
  const requestIdRef = useRef(0)

  // Load the first page when the category changes.
  useEffect(() => {
    const requestId = ++requestIdRef.current
    loadingRef.current = true
    setLoading(true)
    setAllProducts([])
    setPage(1)
    setTotalPages(1)
    setHasMore(true)

    const loadFirstPage = async () => {
      const result = await fetchProducts({
        category: currentCategory,
        page: 1,
        limit: 20,
      })

      if (requestId !== requestIdRef.current) return

      if (result.success) {
        const resultPage = result.pagination?.page || 1
        const resultPages = result.pagination?.pages || 0

        setAllProducts(result.data)
        setPage(resultPage)
        setTotalPages(resultPages)
        setHasMore(resultPage < resultPages)
      }

      loadingRef.current = false
      setLoading(false)
    }

    loadFirstPage()

    return () => {
      requestIdRef.current += 1
    }
  }, [currentCategory, fetchProducts])

  // Load the next page when scrolling.
  const fetchMore = async () => {
    if (loadingRef.current || !hasMore) return

    const nextPage = page + 1
    if (nextPage > totalPages) {
      setHasMore(false)
      return
    }

    const requestId = requestIdRef.current
    loadingRef.current = true
    setLoading(true)

    const result = await fetchProducts({
      category: currentCategory,
      page: nextPage,
      limit: 20,
    })

    if (requestId !== requestIdRef.current) return

    if (!result.success) {
      loadingRef.current = false
      setLoading(false)
      return
    }

    const resultPage = result.pagination?.page || nextPage
    const resultPages = result.pagination?.pages || totalPages

    setAllProducts(prev => [...prev, ...result.data])
    setPage(resultPage)
    setTotalPages(resultPages)
    setHasMore(resultPage < resultPages)
    loadingRef.current = false
    setLoading(false)
  }

  // Render product page with infinite scroll and skeleton loader
  return (
    <div className="product-page">
      {/* Page title */}
      <h1 className="product-page__title">Products</h1>

      {/* Category filter buttons */}
      <CategoryButtons
        currentCategory={currentCategory}
        onChange={setCurrentCategory}
      />

      {/* Infinite scroll for products */}
      <InfiniteScroll
        dataLength={allProducts.length}
        next={fetchMore}
        hasMore={hasMore}
        // Show skeleton cards while loading more
        loader={<Skeleton type="product-card" count={4} />}
        endMessage={<div className="product-page__end">No more products</div>}
      >
        {/* Product grid or skeletons */}
        <ProductList
          products={allProducts}
          loading={loading && page === 1}
        />
      </InfiniteScroll>
    </div>
  )
}
