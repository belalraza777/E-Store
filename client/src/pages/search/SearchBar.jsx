import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import './SearchBar.css';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Navigate to search results
  const searchNavigate = useCallback((searchQuery) => {
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  }, [navigate]);

  // Debounce navigation
  useEffect(() => {
    if (!query.trim()) return;
    const timer = setTimeout(() => searchNavigate(query), 600);
    return () => clearTimeout(timer);
  }, [query, searchNavigate]);

  // Handle input change
  const handleChange = useCallback((e) => {
    setQuery(e.target.value);
  }, []);

  // Handle Enter key for immediate search
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      searchNavigate(query);
    }
  }, [query, searchNavigate]);

  return (
    <div className="search-bar">
      <FiSearch className="search-bar__icon" aria-hidden="true" />
      <input
        type="text"
        className="search-bar__input"
        placeholder="Search products..."
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        aria-label="Search products"
      />
    </div>
  );
}
