import { useLocation } from 'react-router-dom';
import './Search.css';
import { useEffect } from 'react';
import ProductList from '../../components/product/ProductList.jsx';
import { toast } from "sonner";
import useSearchStore from '../../store/searchStore';

export default function Search() {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('q');
    const { results, search, loading, error } = useSearchStore();

    useEffect(() => {
        if (query && query.trim() !== '') {
            search(query);
        }
    }, [query, search]);

    if (loading) {
        return (
            <div className="search-page">
                <div className="search-page__loading" aria-live="polite">
                    <span className="search-page__spinner" aria-hidden="true" />
                    <span>Searching…</span>
                </div>
            </div>
        );
    }
    if (error) {
        toast.error(error);
    }

    return (
        <div className="search-page">
            <h1 className="search-page__heading">
                Search Results for &ldquo;{query}&rdquo;
            </h1>
            <ProductList products={results} />
        </div>
    );
}
