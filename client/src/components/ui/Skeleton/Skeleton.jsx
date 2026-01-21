import React from 'react'
import './Skeleton.css'

/**
 * Skeleton - reusable loading placeholder.
 * Rules:
 * - Component-scoped CSS only (see Skeleton.css)
 * - Uses only global theme variables from index.css
 */
export default function Skeleton({
  variant = 'block', // block | text | circle
  width,
  height,
  radius,
  className = '',
  style,
  'aria-label': ariaLabel = 'Loading',
}) {
  const inlineStyle = {
    width,
    height,
    borderRadius: radius,
    ...style,
  }

  const variantClass =
    variant === 'text'
      ? 'skeleton skeleton--text'
      : variant === 'circle'
        ? 'skeleton skeleton--circle'
        : 'skeleton'

  return (
    <span
      className={`${variantClass} ${className}`.trim()}
      style={inlineStyle}
      aria-label={ariaLabel}
      role="status"
    />
  )
}

