
import React, { useEffect, useState } from 'react'
import useProductStore from '../../store/productStore.js'
import ProductList from '../../components/product/ProductList.jsx'
import CategoryButtons from '../../components/product/CategoryButtons.jsx'
import Pagination from '../../components/ui/Pagination/Pagination.jsx'
import './Product.css'

export default function Product() {
  const fetchProducts = useProductStore(state => state.fetchProducts)

  const [products, setProducts] = useState([])
  const [currentCategory, setCurrentCategory] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  // Load the selected page whenever the category or page changes.
  useEffect(() => {
    let cancelled = false
    setLoading(true)

    const loadProducts = async () => {
      try {
        const result = await fetchProducts({
          category: currentCategory,
          page,
          limit: 20,
        })

        if (!cancelled && result.success) {
          setProducts(result.data || [])
          setTotalPages(result.pagination?.pages || 1)
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to load products:', error)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      cancelled = true
    }
  }, [currentCategory, page, fetchProducts])

  const handleCategoryChange = (category) => {
    setCurrentCategory(category)
    setPage(1)
  }

  return (
    <div className="product-page">
      <h1 className="product-page__title">Products</h1>

      <CategoryButtons
        currentCategory={currentCategory}
        onChange={handleCategoryChange}
      />

      <ProductList products={products} loading={loading} />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  )
}
