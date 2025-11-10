import React, { useState, useRef, memo } from 'react';
import ProductCard from './ProductCard';

const FeaturedProductsCarousel = ({ products }) => {
  const carouselRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const rafId = useRef(null);
  const momentum = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);

  // Atualização suave do scroll com RAF
  const updateScroll = () => {
    const container = carouselRef.current;
    if (!container || !isDragging.current) return;

    rafId.current = requestAnimationFrame(updateScroll);
  };

  // Handlers para arrastar
  const handleMouseDown = (e) => {
    const container = carouselRef.current;
    if (!container) return;
    
    isDragging.current = true;
    startX.current = e.pageX - container.offsetLeft;
    scrollLeft.current = container.scrollLeft;
    lastX.current = e.pageX;
    lastTime.current = Date.now();
    momentum.current = 0;
    
    container.style.cursor = 'grabbing';
    container.style.scrollBehavior = 'auto';
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    
    const container = carouselRef.current;
    if (!container) return;
    
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX.current) * 1.5; // Sensibilidade
    
    // Usar requestAnimationFrame para scroll suave
    if (rafId.current) cancelAnimationFrame(rafId.current);
    
    rafId.current = requestAnimationFrame(() => {
      container.scrollLeft = scrollLeft.current - walk;
    });
    
    // Calcular momentum para inertia
    const now = Date.now();
    const dt = now - lastTime.current;
    if (dt > 0) {
      momentum.current = (e.pageX - lastX.current) / dt;
    }
    lastX.current = e.pageX;
    lastTime.current = now;
  };

  const applyMomentum = () => {
    const container = carouselRef.current;
    if (!container || Math.abs(momentum.current) < 0.1) return;
    
    momentum.current *= 0.95; // Fricção
    container.scrollLeft -= momentum.current * 16; // 16ms per frame
    
    requestAnimationFrame(applyMomentum);
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    
    isDragging.current = false;
    const container = carouselRef.current;
    
    if (container) {
      container.style.cursor = 'grab';
      container.style.scrollBehavior = 'smooth';
    }
    
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    
    // Aplicar momentum/inertia
    if (Math.abs(momentum.current) > 0.5) {
      applyMomentum();
    }
  };

  const handleMouseLeave = () => {
    if (isDragging.current) {
      handleMouseUp();
    }
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    const container = carouselRef.current;
    if (!container) return;
    
    isDragging.current = true;
    startX.current = e.touches[0].pageX - container.offsetLeft;
    scrollLeft.current = container.scrollLeft;
    lastX.current = e.touches[0].pageX;
    lastTime.current = Date.now();
    momentum.current = 0;
    
    container.style.scrollBehavior = 'auto';
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    
    const container = carouselRef.current;
    if (!container) return;
    
    const x = e.touches[0].pageX - container.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    
    // RAF para scroll suave
    if (rafId.current) cancelAnimationFrame(rafId.current);
    
    rafId.current = requestAnimationFrame(() => {
      container.scrollLeft = scrollLeft.current - walk;
    });
    
    // Calcular momentum
    const now = Date.now();
    const dt = now - lastTime.current;
    if (dt > 0) {
      momentum.current = (e.touches[0].pageX - lastX.current) / dt;
    }
    lastX.current = e.touches[0].pageX;
    lastTime.current = now;
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    
    isDragging.current = false;
    const container = carouselRef.current;
    
    if (container) {
      container.style.scrollBehavior = 'smooth';
    }
    
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    
    // Aplicar momentum
    if (Math.abs(momentum.current) > 0.5) {
      applyMomentum();
    }
  };

  return (
    <div className="relative">
      {/* Container do Carrossel com scroll livre */}
      <div 
        ref={carouselRef}
        className="flex gap-2 sm:gap-4 overflow-x-auto scrollbar-hide select-none pb-4 scroll-snap-x smooth-scroll will-change-transform"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          cursor: 'grab'
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
            className="flex-shrink-0 w-[45%] sm:w-[30%] md:w-[23%] lg:w-[18%] xl:w-[15%] scroll-snap-item"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(FeaturedProductsCarousel);
