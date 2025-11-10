import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ 
  rating = 0, 
  onChange = null, 
  size = 'md', 
  showValue = false,
  readOnly = false 
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const isInteractive = !readOnly && onChange !== null;

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  const handleClick = (value) => {
    if (isInteractive) {
      onChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (isInteractive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (isInteractive) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => handleClick(value)}
            onMouseEnter={() => handleMouseEnter(value)}
            onMouseLeave={handleMouseLeave}
            disabled={!isInteractive}
            className={`${isInteractive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} 
                       transition-transform duration-150 ${readOnly ? '' : 'focus:outline-none'}`}
          >
            <Star
              className={`${sizes[size]} transition-colors ${
                value <= displayRating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-gray-200 text-gray-200'
              }`}
            />
          </button>
        ))}
      </div>
      {showValue && (
        <span className="text-sm font-semibold text-gray-700">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
