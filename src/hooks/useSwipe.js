import { useRef, useEffect } from 'react';

/**
 * Hook customizado para adicionar funcionalidade de swipe/arrastar em carrosséis
 * @param {Function} onSwipeLeft - Callback quando usuário arrasta para esquerda
 * @param {Function} onSwipeRight - Callback quando usuário arrasta para direita
 * @param {number} threshold - Distância mínima em pixels para considerar swipe (padrão: 50)
 * @returns {Object} - Ref para anexar ao elemento
 */
const useSwipe = (onSwipeLeft, onSwipeRight, threshold = 50) => {
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const isDragging = useRef(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Handlers para touch (mobile)
    const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
      isDragging.current = true;
    };

    const handleTouchMove = (e) => {
      if (!isDragging.current) return;
      touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      if (!isDragging.current) return;
      
      const distance = touchStartX.current - touchEndX.current;
      const isSignificantSwipe = Math.abs(distance) > threshold;

      if (isSignificantSwipe) {
        if (distance > 0) {
          // Swipe para esquerda (próximo)
          onSwipeLeft?.();
        } else {
          // Swipe para direita (anterior)
          onSwipeRight?.();
        }
      }

      isDragging.current = false;
    };

    // Handlers para mouse (desktop)
    const handleMouseDown = (e) => {
      touchStartX.current = e.clientX;
      isDragging.current = true;
      element.style.cursor = 'grabbing';
      e.preventDefault(); // Previne seleção de texto
    };

    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      touchEndX.current = e.clientX;
    };

    const handleMouseUp = () => {
      if (!isDragging.current) return;
      
      const distance = touchStartX.current - touchEndX.current;
      const isSignificantSwipe = Math.abs(distance) > threshold;

      if (isSignificantSwipe) {
        if (distance > 0) {
          // Swipe para esquerda (próximo)
          onSwipeLeft?.();
        } else {
          // Swipe para direita (anterior)
          onSwipeRight?.();
        }
      }

      isDragging.current = false;
      element.style.cursor = 'grab';
    };

    const handleMouseLeave = () => {
      if (isDragging.current) {
        isDragging.current = false;
        element.style.cursor = 'grab';
      }
    };

    // Adicionar cursor grab
    element.style.cursor = 'grab';

    // Event listeners para touch
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Event listeners para mouse
    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseup', handleMouseUp);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      // Cleanup
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('mousedown', handleMouseDown);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseup', handleMouseUp);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [onSwipeLeft, onSwipeRight, threshold]);

  return elementRef;
};

export default useSwipe;
