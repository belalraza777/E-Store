import React from 'react';
import PropTypes from 'prop-types';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

const StarRating = ({ value = 0, size = 18, readOnly = true, onChange }) => {
  const stars = [];
  const full = Math.floor(value);
  const half = value - full >= 0.5;

  const handleClick = (idx) => {
    if (readOnly) return;
    onChange && onChange(idx + 1);
  };

  for (let i = 0; i < 5; i++) {
    let icon = <FaRegStar />;
    if (i < full) icon = <FaStar />;
    else if (i === full && half) icon = <FaStarHalfAlt />;

    stars.push(
      <button
        key={i}
        type="button"
        onClick={() => handleClick(i)}
        className="star-btn-inline"
        style={{ background: 'transparent', border: 'none', padding: 4, cursor: readOnly ? 'default' : 'pointer' }}
        aria-label={`${i + 1} star`}
      >
        {React.cloneElement(icon, { size })}
      </button>
    );
  }

  return <div style={{ display: 'flex', gap: 6 }}>{stars}</div>;
};

StarRating.propTypes = {
  value: PropTypes.number,
  size: PropTypes.number,
  readOnly: PropTypes.bool,
  onChange: PropTypes.func,
};

export default StarRating;
