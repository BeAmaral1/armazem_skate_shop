import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Eye, X, Trash2 } from 'lucide-react';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import ProductCard from './ProductCard';

const RecentlyViewedCarousel = ({ limit = 6, showTitle = true, showControls = true }) => {
  const { getRecent, getCount, removeProduct, clearAll } = useRecentlyViewed();
  const scrollContainerRef = useRef(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const recentProducts = getRecent(limit);
  const totalCount = getCount();

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 300;
    const newPosition =
      direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newPosition,
      behavior: 'smooth',
    });
  };

  // Handlers para arrastar com mouse/touch
  const handleMouseDown = (e) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    setIsDragging(true);
    setStartX(e.pageX - container.offsetLeft);
    setScrollLeft(container.scrollLeft);
    container.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2; // Multiplicador para velocidade de scroll
    container.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    const container = scrollContainerRef.current;
    if (container) {
      container.style.cursor = 'grab';
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      const container = scrollContainerRef.current;
      if (container) {
        container.style.cursor = 'grab';
      }
    }
  };

  // Handlers para touch (mobile)
  const handleTouchStart = (e) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    setIsDragging(true);
    setStartX(e.touches[0].pageX - container.offsetLeft);
    setScrollLeft(container.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const x = e.touches[0].pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    container.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  if (recentProducts.length === 0) {
    return null; // Não exibir se não houver produtos
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        {showTitle && (
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900">
                  Vistos Recentemente
                </h2>
                <p className="text-gray-600 text-sm">
                  {totalCount} {totalCount === 1 ? 'produto visto' : 'produtos vistos'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {totalCount > 0 && (
                <button
                  onClick={() => setShowClearModal(true)}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  Limpar Tudo
                </button>
              )}
              
              {totalCount > limit && (
                <Link
                  to="/perfil/vistos-recentemente"
                  className="hidden sm:block text-sm font-medium text-dark-700 hover:text-dark-900 underline"
                >
                  Ver Todos ({totalCount})
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Carousel */}
        <div className="relative group">
          {/* Left Arrow */}
          {showControls && recentProducts.length > 1 && (
            <button
              onClick={() => scroll('left')}
              className="flex absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg items-center justify-center transition-all hover:bg-gray-50 hover:scale-110"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            </button>
          )}

          {/* Products Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-12 sm:px-0 select-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', cursor: 'grab' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {recentProducts.map((product) => (
              <div
                key={product.id}
                className="flex-none w-64 sm:w-72 relative group/card"
              >
                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeProduct(product.id);
                  }}
                  className="absolute top-2 right-2 z-20 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-red-50"
                  title="Remover do histórico"
                >
                  <X className="w-4 h-4 text-gray-600 hover:text-red-600" />
                </button>

                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          {showControls && recentProducts.length > 1 && (
            <button
              onClick={() => scroll('right')}
              className="flex absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg items-center justify-center transition-all hover:bg-gray-50 hover:scale-110"
              aria-label="Próximo"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            </button>
          )}
        </div>

        {/* Mobile View All */}
        {totalCount > limit && (
          <div className="flex justify-center mt-6 sm:hidden">
            <Link
              to="/perfil/vistos-recentemente"
              className="text-sm font-medium text-dark-700 hover:text-dark-900 underline"
            >
              Ver Todos ({totalCount})
            </Link>
          </div>
        )}

        {/* Mobile Clear All */}
        {totalCount > 0 && (
          <div className="flex justify-center mt-4 sm:hidden">
            <button
              onClick={() => setShowClearModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Limpar Tudo
            </button>
          </div>
        )}
      </div>

      {/* Modal de Confirmação */}
      {showClearModal && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-50 animate-fadeIn"
            onClick={() => setShowClearModal(false)}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-slideUp"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Limpar Histórico?
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Esta ação não pode ser desfeita
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-700 leading-relaxed">
                  Você está prestes a remover <strong className="text-gray-900">{totalCount} {totalCount === 1 ? 'produto' : 'produtos'}</strong> do
                  seu histórico de visualizações. Deseja continuar?
                </p>
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                  <Eye className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    Você perderá o acesso rápido a todos os produtos que visualizou recentemente.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 border-t border-gray-200 flex gap-3">
                <button
                  onClick={() => setShowClearModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    clearAll();
                    setShowClearModal(false);
                  }}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Limpar Tudo
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default RecentlyViewedCarousel;
