import React, { useState, useRef, memo } from 'react';
import ProductCard from './ProductCard';

const FeaturedProductsCarousel = ({ products }) => {
  const carouselRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Handlers para arrastar
  const handleMouseDown = (e) => {
    const container = carouselRef.current;
    if (!container) return;
    setIsDragging(true);
    setStartX(e.pageX - container.offsetLeft);
    setScrollLeft(container.scrollLeft);
    container.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const container = carouselRef.current;
    if (!container) return;
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    container.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    const container = carouselRef.current;
    if (container) container.style.cursor = 'grab';
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      const container = carouselRef.current;
      if (container) container.style.cursor = 'grab';
    }
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    const container = carouselRef.current;
    if (!container) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - container.offsetLeft);
    setScrollLeft(container.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const container = carouselRef.current;
    if (!container) return;
    const x = e.touches[0].pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    container.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative">
      {/* Container do Carrossel com scroll livre */}
      <div 
        ref={carouselRef}
        className="flex gap-2 sm:gap-4 overflow-x-auto scrollbar-hide select-none pb-4"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          cursor: 'grab',
          scrollBehavior: 'smooth'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {products.map(product => (
          <div
            key={product.id}
            className="flex-shrink-0 w-[45%] sm:w-[30%] md:w-[23%] lg:w-[18%] xl:w-[15%]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(FeaturedProductsCarousel);
