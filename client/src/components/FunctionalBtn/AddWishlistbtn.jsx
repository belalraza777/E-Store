
import { useMemo } from 'react'
import useWishlistStore from '../../store/wishlistStore';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import './AddWishlistbtn.css';
import { toast } from 'sonner';

export default function AddWishlistbtn({ productId }) {    
    if (!productId) return null;

    // Get the addProduct function and current wishlist from the store
    const { addProduct, removeProduct, wishlist } = useWishlistStore();

    //Flag to check if product is in wishlist or not
    const isInWishlist = useMemo(() => {
        if (!wishlist) return false;
        return wishlist.some(item => String(item) === String(productId));
    }, [wishlist, productId]);

    // Handler for adding/removing product from wishlist
    const handleAddToWishlist = async () => {
        if (isInWishlist) {
            await removeProduct(productId);
        } else {
            await addProduct(productId);
            toast.success("Product added to wishlist!");
        }
    };

    return (
        <button
            onClick={handleAddToWishlist}
            className="wishlist-heart"
            aria-label="Toggle wishlist"
        >
            {isInWishlist ? (
                <FaHeart className="heart filled" />
            ) : (
                <FaRegHeart className="heart" />
            )}
        </button>

    )
}
