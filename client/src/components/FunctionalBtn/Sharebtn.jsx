import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { RiShareBoxLine, RiShareCircleFill } from "react-icons/ri";
import './AddWishlistbtn.css';

export default function Sharebtn({ slug }) {

    const [loading, setLoading] = useState(false);

    // Share product details link to clipboard or use native share if available
    const handleShare = useCallback(async () => {
        if (loading) return;
        setLoading(true);
        const productUrl = `${window.location.origin}/product/${slug}`;
        try {
            // Check if native share is available (mobile devices)
            if (navigator.share) {
                await navigator.share({
                    title: `Check out this product!`,
                    text: "Check out this product on E-STORE!",
                    url: productUrl,
                });
            } else {
                // Fallback: Copy to clipboard
                await navigator.clipboard.writeText(productUrl);
                toast.success("Link copied to clipboard!");
            }
        } catch (err) {
            // User cancelled the share or error occurred
            if (err.name !== "AbortError") {
                console.error("Share error:", err);
                toast.error("Failed to share");
            }
        } finally {
            setLoading(false);
        }
    }, [slug]);

    return (
        <div>
            <button
                className="share-btn"
                onClick={handleShare}
                disabled={loading}
                aria-label="Share product"
            >
                {loading ? <RiShareCircleFill /> : <RiShareBoxLine size={20} />}
            </button>
        </div >
    )
}
