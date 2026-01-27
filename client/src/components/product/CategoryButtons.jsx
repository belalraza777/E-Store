
import React, { useEffect } from 'react';
import useProductStore from '../../store/productStore.js';
import './CategoryButtons.css';

export default function CategoryButtons({ currentCategory, onChange }) {
  const categories = useProductStore(s => s.categories);
  const fetchCategories = useProductStore(s => s.fetchCategories);

  useEffect(() => {
    if (!categories || categories.length === 0) {
      fetchCategories();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="category-buttons">
      {/* All category button */}
      <button
        className={currentCategory === 'all' ? 'active' : ''}
        onClick={() => onChange('all')}
      >
        All
      </button>

      {/* Dynamic category buttons */}
      {categories && categories.map(category => (
        <button
          key={category}
          className={currentCategory === category ? 'active' : ''}
          onClick={() => onChange(category)}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
      ))}
    </div>
  );
}
