import { useState, useEffect } from 'react'
import './AddCartbtn.css';
import useCartStore from "../../store/cartStore.js";
import { toast } from "sonner";
import { useAuth } from '../../context/authContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function AddCartBtn({ productId, quantity }) {
    const { user } = useAuth();
    const navigate = useNavigate();

    const { addItem } = useCartStore();
    const [isLoading, setIsLoading] = useState(false);

    // Function to handle adding item to cart
    const handleAddToCart = async () => {
        if (!user) {
            toast.error("Please log in to add items to your cart");
            navigate('/login');
            return;
        }
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
    };


    return (
        <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="add-to-cart-btn"
        >
            {isLoading ? "Adding..." : "Add to Cart"}
        </button>
    );
}
