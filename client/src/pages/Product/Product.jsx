
// Product page with infinite scroll, category filter, and skeleton loading
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import useProductStore from '../../store/productStore.js'
import ProductList from '../../components/product/ProductList.jsx'
import CategoryButtons from '../../components/product/CategoryButtons.jsx'
import './Product.css'
import Skeleton from '../../components/ui/Skeleton/Skeleton.jsx'



export default function Product() {
  const { fetchProducts } = useProductStore() // get fetch function from store

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

  // Load first page on category change
  useEffect(() => {
    loadFirstPage()
  }, [currentCategory])

  // Filter products by selected category
  const filterByCategory = (products) => {
    if (currentCategory === 'all') return products
    return products.filter(
      product => product?.category === currentCategory
    )
  }

  // Fetch first page of products
  const loadFirstPage = async () => {
    if (loading) return
    setLoading(true)

    const result = await fetchProducts({ page: 1 })
    if (!result.success) {
      setLoading(false)
      return
    }

    const filteredProducts = filterByCategory(result.data)

    setAllProducts(filteredProducts)
    setPage(1)
    setTotalPages(result.pagination.pages) // set total pages from API
    setHasMore(result.pagination.pages > 1) // enable infinite scroll if more pages
    setLoading(false)
  }

  // Fetch next page for infinite scroll
  const fetchMore = async () => {
    if (loading || !hasMore) return
    setLoading(true)

    const nextPage = page + 1
    if (nextPage > totalPages) {
      setHasMore(false)
      setLoading(false)
      return
    }

    const result = await fetchProducts({ page: nextPage })
    if (!result.success) {
      setLoading(false)
      return
    }

    const filteredProducts = filterByCategory(result.data)

    setAllProducts(prev => [...prev, ...filteredProducts]) // append new products
    setPage(nextPage)
    setHasMore(nextPage < totalPages)
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
