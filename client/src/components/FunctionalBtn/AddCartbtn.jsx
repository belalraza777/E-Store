import { useState } from 'react'
import useCartStore from "../../store/cartStore.js";
import { toast } from "sonner";

export default function AddCartBtn({ productId, quantity }) {
    const { addItem } = useCartStore();
    const [isLoading, setIsLoading] = useState(false);
    
    // Handle add to cart action
    const handleAddToCart = async () => {
        if (isLoading) return; 
        setIsLoading(true);
        try {
            const result = await addItem(productId, quantity);
            if (result?.success) {
                toast.success("Item added to cart");
            } else {
                toast.error(result?.message || "Failed to add item to cart");
            }
        } catch (err) {
            toast.error(err.message || "Failed to add item to cart");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <button 
            onClick={handleAddToCart}
            disabled={isLoading}
            className="add-to-cart-btn"
        >
            {isLoading ? "Adding..." : "Add to Cart"}
        </button>
    )
}
