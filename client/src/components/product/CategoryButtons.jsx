import { CATEGORIES } from '../../constants/categories.js'
import './CategoryButtons.css'

export default function CategoryButtons({ currentCategory, onChange }) {
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
      {CATEGORIES.map(category => (
        <button
          key={category}
          className={currentCategory === category ? 'active' : ''}
          onClick={() => onChange(category)}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
      ))}
    </div>
  )
}
