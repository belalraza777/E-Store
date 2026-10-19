
import React, { useEffect, useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import useProductStore from '../../store/productStore.js'
import ProductList from '../../components/product/ProductList.jsx'
import CategoryButtons from '../../components/product/CategoryButtons.jsx'
import './Product.css'
import Skeleton from '../../components/ui/Skeleton/Skeleton.jsx'

export default function Product() {
  const fetchProducts = useProductStore(state => state.fetchProducts)

  const [allProducts, setAllProducts] = useState([])
  const [currentCategory, setCurrentCategory] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  const loadingRef = useRef(false)
  const requestIdRef = useRef(0)

  // Load the first page whenever the category changes.
  useEffect(() => {
    const requestId = ++requestIdRef.current

    loadingRef.current = true
    setLoading(true)
    setAllProducts([])
    setPage(1)
    setTotalPages(1)
    setHasMore(true)

    const loadFirstPage = async () => {
      try {
        const result = await fetchProducts({
          category: currentCategory,
          page: 1,
          limit: 20,
        })

        // Ignore results from an outdated category request.
        if (requestId !== requestIdRef.current) return

        if (result.success) {
          const resultPage = result.pagination?.page || 1
          const resultPages = result.pagination?.pages || 0

          setAllProducts(result.data || [])
          setPage(resultPage)
          setTotalPages(resultPages)
          setHasMore(resultPage < resultPages)
        } else {
          setHasMore(false)
        }
      } catch (error) {
        if (requestId === requestIdRef.current) {
          setHasMore(false)
          console.error('Failed to load products:', error)
        }
      } finally {
        if (requestId === requestIdRef.current) {
          loadingRef.current = false
          setLoading(false)
        }
      }
    }

    loadFirstPage()

    return () => {
      // Invalidate requests when the category changes or page unmounts.
      requestIdRef.current += 1
    }
  }, [currentCategory, fetchProducts])

  // Append the next page without replacing existing cards.
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

    try {
      const result = await fetchProducts({
        category: currentCategory,
        page: nextPage,
        limit: 20,
      })

      // Ignore responses belonging to an older category.
      if (requestId !== requestIdRef.current) return

      if (!result.success) return

      const newProducts = result.data || []
      const resultPage = result.pagination?.page || nextPage
      const resultPages = result.pagination?.pages ?? totalPages

      // Avoid duplicate cards if a page is fetched more than once.
      setAllProducts(previousProducts => {
        const existingIds = new Set(
          previousProducts.map(product => product._id)
        )

        const uniqueProducts = newProducts.filter(
          product => !existingIds.has(product._id)
        )

        return [...previousProducts, ...uniqueProducts]
      })

      setPage(resultPage)
      setTotalPages(resultPages)
      setHasMore(resultPage < resultPages)
    } catch (error) {
      if (requestId === requestIdRef.current) {
        console.error('Failed to load more products:', error)
      }
    } finally {
      if (requestId === requestIdRef.current) {
        loadingRef.current = false
        setLoading(false)
      }
    }
  }

  return (
    <div className="product-page">
      <h1 className="product-page__title">Products</h1>

      <CategoryButtons
        currentCategory={currentCategory}
        onChange={setCurrentCategory}
      />

      <InfiniteScroll
        dataLength={allProducts.length}
        next={fetchMore}
        hasMore={hasMore}
        loader={<Skeleton type="product-card" count={4} />}
        endMessage={
          allProducts.length > 0 ? (
            <div className="product-page__end">
              No more products
            </div>
          ) : null
        }
      >
        <ProductList
          products={allProducts}
          // Show the full-page skeleton only when no products exist.
          loading={loading && allProducts.length === 0}
        />
      </InfiniteScroll>
    </div>
  )
}
