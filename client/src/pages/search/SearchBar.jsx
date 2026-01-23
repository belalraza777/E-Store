import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import './SearchBar.css';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Debounce navigation
  useEffect(() => {
    if (!query.trim()) return; // do nothing if input is empty
    const timer = setTimeout(() => {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }, 600); // 600ms debounce

    return () => clearTimeout(timer); // clear previous timer
  }, [query, navigate]);

  // Handle Enter key for immediate search
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="search-bar">
      <FiSearch className="search-bar__icon" aria-hidden="true" />
      <input
        type="text"
        className="search-bar__input"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyPress}
        aria-label="Search products"
      />
    </div>
  );
}
