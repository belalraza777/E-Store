import { redirect, useLocation, useNavigate } from 'react-router-dom';
import './Search.css';
import { useEffect } from 'react';
import ProductList from '../../components/product/ProductList.jsx';
import { toast } from "sonner";
import useSearchStore from '../../store/searchStore';

export default function Search() {
    // Get search query from URL and perform search
    const location = useLocation();
    const navigate = useNavigate();
    // Extract 'q' parameter from URL
    const query = new URLSearchParams(location.search).get('q');
    // Get search results and state from store
    const { results, search, loading, error } = useSearchStore();
    // Check if query is valid (not empty)
    const hasQuery = query != null && query.trim() !== '';

    // Perform search when component mounts or query changes
    useEffect(() => {
        if (!hasQuery) {
            navigate('/products', { replace: true });
            return;
        }
        search(query);
    }, [query, hasQuery, search, navigate]);

    // If no valid query, don't show anything (or could redirect to products page)
    if (!hasQuery) {
        return null;
    }

    // Show loading state
    if (loading) {
        return (
            <div className="search-page">
                <ProductList products={[]} loading={true} />
            </div>
        );
    }
    if (error) {
        toast.error(error);
    }

    return (
        // Show search results
        <div className="search-page">
            <h1 className="search-page__heading">
                Search Results for &ldquo;{query}&rdquo;
            </h1>
            <ProductList products={results} />
        </div>
    );
}
