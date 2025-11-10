import { useEffect, useRef, useState } from 'react';

/**
 * Hook para detectar quando elemento entra no viewport
 * Útil para lazy loading inteligente
 */
export const useIntersectionObserver = (options = {}) => {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);
        
        // Uma vez visível, marca como já visto
        if (visible && !hasBeenVisible) {
          setHasBeenVisible(true);
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '50px',
        ...options
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options.threshold, options.rootMargin, hasBeenVisible]);

  return { elementRef, isVisible, hasBeenVisible };
};

export default useIntersectionObserver;
