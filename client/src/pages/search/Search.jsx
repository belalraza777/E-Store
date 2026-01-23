import { useLocation, useNavigate } from 'react-router-dom';
import './Search.css';
import { useEffect } from 'react';
import ProductList from '../../components/product/ProductList.jsx';
import { toast } from "sonner";
import useSearchStore from '../../store/searchStore';

export default function Search() {
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search).get('q');
    const { results, search, loading, error } = useSearchStore();

    const hasQuery = query != null && query.trim() !== '';

    useEffect(() => {
        if (!hasQuery) {
            navigate('/products', { replace: true });
            return;
        }
        search(query);
    }, [query, hasQuery, search, navigate]);

    if (!hasQuery) {
        return null;
    }

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
        <div className="search-page">
            <h1 className="search-page__heading">
                Search Results for &ldquo;{query}&rdquo;
            </h1>
            <ProductList products={results} />
        </div>
    );
}
