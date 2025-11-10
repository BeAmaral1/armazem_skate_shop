import React from 'react';

const ProductCardSkeleton = () => {
  return (
    <div className="card animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        
        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        
        {/* Rating */}
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        
        {/* Price */}
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        
        {/* Button */}
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
