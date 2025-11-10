import { useRef, useEffect } from 'react';

/**
 * Hook customizado OTIMIZADO para swipe/arrastar suave em carrosséis
 * @param {Function} onSwipeLeft - Callback quando usuário arrasta para esquerda
 * @param {Function} onSwipeRight - Callback quando usuário arrasta para direita
 * @param {number} threshold - Distância mínima em pixels para considerar swipe (padrão: 50)
 * @returns {Object} - Ref para anexar ao elemento
 */
const useSwipe = (onSwipeLeft, onSwipeRight, threshold = 50) => {
  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);
  const isDragging = useRef(false);
  const elementRef = useRef(null);
  const innerElement = useRef(null);
  const rafId = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Encontrar elemento interno com a transição
    innerElement.current = element.querySelector('[style*="transform"]') || element.firstElementChild;

    // Otimizar para GPU rendering
    if (innerElement.current) {
      innerElement.current.style.willChange = 'transform';
    }

    // Atualizar visual durante drag (60fps)
    const updateDragPosition = () => {
      if (!isDragging.current || !innerElement.current) return;

      const diff = touchCurrentX.current - touchStartX.current;
      const dragAmount = diff * 0.5; // Resistência de 50%

      // Usar transform para animação suave via GPU
      innerElement.current.style.transition = 'none';
      innerElement.current.style.transform = `translateX(calc(${innerElement.current.dataset.baseTransform || '0%'} + ${dragAmount}px))`;

      rafId.current = requestAnimationFrame(updateDragPosition);
    };

    // Handlers para touch (mobile)
    const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
      touchCurrentX.current = e.touches[0].clientX;
      isDragging.current = true;

      // Salvar posição base
      if (innerElement.current) {
        const currentTransform = window.getComputedStyle(innerElement.current).transform;
        if (currentTransform !== 'none') {
          const matrix = new DOMMatrix(currentTransform);
          innerElement.current.dataset.baseTransform = `${matrix.e}px`;
        }
      }

      // Iniciar animação
      rafId.current = requestAnimationFrame(updateDragPosition);
    };

    const handleTouchMove = (e) => {
      if (!isDragging.current) return;
      touchCurrentX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      if (!isDragging.current) return;

      // Cancelar animação
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      
      const distance = touchStartX.current - touchCurrentX.current;
      const isSignificantSwipe = Math.abs(distance) > threshold;

      // Restaurar transição
      if (innerElement.current) {
        innerElement.current.style.transition = '';
        innerElement.current.style.transform = '';
        delete innerElement.current.dataset.baseTransform;
      }

      if (isSignificantSwipe) {
        if (distance > 0) {
          onSwipeLeft?.();
        } else {
          onSwipeRight?.();
        }
      }

      isDragging.current = false;
    };

    // Handlers para mouse (desktop)
    const handleMouseDown = (e) => {
      touchStartX.current = e.clientX;
      touchCurrentX.current = e.clientX;
      isDragging.current = true;
      element.style.cursor = 'grabbing';
      element.style.userSelect = 'none';

      // Salvar posição base
      if (innerElement.current) {
        const currentTransform = window.getComputedStyle(innerElement.current).transform;
        if (currentTransform !== 'none') {
          const matrix = new DOMMatrix(currentTransform);
          innerElement.current.dataset.baseTransform = `${matrix.e}px`;
        }
      }

      // Iniciar animação
      rafId.current = requestAnimationFrame(updateDragPosition);
      e.preventDefault();
    };

    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      touchCurrentX.current = e.clientX;
    };

    const handleMouseUp = () => {
      if (!isDragging.current) return;

      // Cancelar animação
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      
      const distance = touchStartX.current - touchCurrentX.current;
      const isSignificantSwipe = Math.abs(distance) > threshold;

      // Restaurar transição
      if (innerElement.current) {
        innerElement.current.style.transition = '';
        innerElement.current.style.transform = '';
        delete innerElement.current.dataset.baseTransform;
      }

      if (isSignificantSwipe) {
        if (distance > 0) {
          onSwipeLeft?.();
        } else {
          onSwipeRight?.();
        }
      }

      isDragging.current = false;
      element.style.cursor = 'grab';
      element.style.userSelect = '';
    };

    const handleMouseLeave = () => {
      if (isDragging.current) {
        // Cancelar animação
        if (rafId.current) {
          cancelAnimationFrame(rafId.current);
        }

        // Restaurar estado
        if (innerElement.current) {
          innerElement.current.style.transition = '';
          innerElement.current.style.transform = '';
          delete innerElement.current.dataset.baseTransform;
        }

        isDragging.current = false;
        element.style.cursor = 'grab';
        element.style.userSelect = '';
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
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      if (innerElement.current) {
        innerElement.current.style.willChange = '';
      }
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
