import React, { useEffect } from 'react'
import useWishlistStore from '../../store/wishlistStore'
import ProductCard from '../../components/product/ProductCard'
import './Wishlist.css'
import { FaTrashAlt } from 'react-icons/fa'
import { toast } from 'sonner';

export default function Wishlist() {
    const { wishlistProducts, loading, error, fetchWishlist, removeProduct } = useWishlistStore();

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    // Handler for removing product from wishlist
    const handleRemove = async (productId) => {
        await removeProduct(productId);
        toast.success("Product removed from wishlist!");
        await fetchWishlist(); // Refresh wishlist after removal
    }

    if (loading) return <div>Loading wishlist...</div>
    if (error) return <div>Error: {error}</div>
    // Show empty state if no products in wishlist
    if (!wishlistProducts || wishlistProducts.length === 0)
        return (
            <div className="wishlist-empty">
                <div className="wishlist-empty-card">
                    <svg width="96" height="96" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="empty-icon" aria-hidden>
                        <path d="M12 21s-6-4.35-8-6c-1.13-0.9-2-2.24-2-3.5C2 8.91 4.91 6 8.5 6 10 6 11 6.5 12 7.5 13 6.5 14 6 15.5 6 19.09 6 22 8.91 22 12.5c0 1.26-0.87 2.6-2 3.5-2 1.65-8 6-8 6z" fill="#f87171" />
                    </svg>
                    <h2>Your wishlist is empty</h2>
                    <p>Save products you like so you can find them later.</p>
                    <a href="/products" className="wishlist-cta">Browse products</a>
                </div>
            </div>
        )

    return (
        <div className="wishlist-page">
            <h1>Your Wishlist</h1>

            <div className="product-list">
                {wishlistProducts.map(product => (
                    <div key={product._id} className="wishlist-item-wrapper">
                        <button
                            className="wishlist-remove-btn"
                            aria-label="Remove from wishlist"
                            onClick={() => handleRemove(product._id)}
                        >
                            <FaTrashAlt />
                        </button>
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    )
}
