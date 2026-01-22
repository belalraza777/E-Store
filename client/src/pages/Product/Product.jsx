import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import useProductStore from '../../store/productStore.js'
import ProductList from '../../components/product/ProductList.jsx'
import CategoryButtons from '../../components/product/CategoryButtons.jsx'
import './Product.css'

export default function Product() {
  // Fetch function from store
  const { fetchProducts } = useProductStore()
  // Products state
  const [allProducts, setAllProducts] = useState([])
  // Category state
  const [currentCategory, setCurrentCategory] = useState('all')
  // Pagination states
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // Loading state
  const [loading, setLoading] = useState(false)

  // Reload products on category change
  useEffect(() => {
    loadFirstPage()
  }, [currentCategory])

  // Filter products by category
  const filterByCategory = (products) => {
    if (currentCategory === 'all') return products
    return products.filter(
      product => product?.category === currentCategory
    )
  }

  // Load first page
  const loadFirstPage = async () => {
    setLoading(true)

    const result = await fetchProducts({ page: 1 })
    if (!result.success) return

    const filteredProducts = filterByCategory(result.data)

    setAllProducts(filteredProducts)
    setPage(1)
    setTotalPages(result.pagination.totalPages)
    setHasMore(result.pagination.totalPages > 1)

    setLoading(false)
  }

  // Load more products
  const fetchMore = async () => {
    const nextPage = page + 1
    if (nextPage > totalPages) {
      setHasMore(false)
      return
    }

    const result = await fetchProducts({ page: nextPage })
    if (!result.success) return

    const filteredProducts = filterByCategory(result.data)

    setAllProducts(prev => [...prev, ...filteredProducts])
    setPage(nextPage)
    setHasMore(nextPage < totalPages)
  }

  return (
    <div className="product-page">
      {/* Page title */}
      <h1 className="product-page__title">Products</h1>

      {/* Category buttons component */}
      <CategoryButtons
        currentCategory={currentCategory}
        onChange={setCurrentCategory}
      />

      {/* Infinite scroll */}
      <InfiniteScroll
        dataLength={allProducts.length}
        next={fetchMore}
        hasMore={hasMore}
        loader={<div className="product-page__loader">Loading more...</div>}
        endMessage={<div className="product-page__end">No more products</div>}
      >
        {/* Product list */}
        <ProductList products={allProducts} loading={loading && page === 1} />
      </InfiniteScroll>
    </div>
  )
}
