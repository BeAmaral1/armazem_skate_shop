/**
 * Utilitários para otimizar performance de scroll
 * Throttle, debounce e detecção de scroll ativo
 */

/**
 * Throttle - executa função no máximo 1x por intervalo
 * Perfeito para eventos de scroll/resize que disparam muito
 */
export const throttle = (func, delay = 16) => {
  let lastCall = 0;
  let timeoutId = null;

  return function executedFunction(...args) {
    const now = Date.now();

    if (now - lastCall < delay) {
      // Se ainda está no delay, agendar para depois
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        lastCall = now;
        func(...args);
      }, delay);
    } else {
      // Executar imediatamente
      lastCall = now;
      func(...args);
    }
  };
};

/**
 * Debounce - executa função apenas após parar de chamar
 * Perfeito para inputs de busca
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;

  return function executedFunction(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

/**
 * Detecta quando usuário está scrollando ativamente
 * Adiciona classe 'scrolling' no body durante scroll
 */
export const setupScrollDetection = () => {
  let scrollTimeout;
  let isScrolling = false;

  const handleScroll = throttle(() => {
    if (!isScrolling) {
      document.body.classList.add('scrolling');
      isScrolling = true;
    }

    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {
      document.body.classList.remove('scrolling');
      isScrolling = false;
    }, 150); // Remove classe 150ms após parar
  }, 50);

  window.addEventListener('scroll', handleScroll, { passive: true });

  return () => {
    window.removeEventListener('scroll', handleScroll);
    clearTimeout(scrollTimeout);
  };
};

/**
 * Intersection Observer otimizado para lazy loading
 * Observa elementos e executa callback quando ficam visíveis
 */
export const createLazyObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.01,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { ...defaultOptions, ...options });

  return observer;
};

/**
 * Smooth scroll para elemento específico
 * Melhor que scrollIntoView nativo
 */
export const smoothScrollTo = (element, offset = 0, duration = 500) => {
  if (!element) return;

  const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  const animation = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);

    // Easing function (easeInOutCubic)
    const ease = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    window.scrollTo(0, startPosition + distance * ease);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  };

  requestAnimationFrame(animation);
};

/**
 * Otimizar performance de imagens durante scroll
 * Reduz qualidade temporariamente durante scroll rápido
 */
export const optimizeImagesOnScroll = () => {
  let scrollTimeout;
  const images = document.querySelectorAll('img');

  const handleScroll = throttle(() => {
    // Durante scroll, imagens menos nítidas mas mais rápidas
    images.forEach(img => {
      img.style.imageRendering = 'auto';
    });

    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {
      // Depois de parar, volta qualidade normal
      images.forEach(img => {
        img.style.imageRendering = '';
      });
    }, 200);
  }, 100);

  window.addEventListener('scroll', handleScroll, { passive: true });

  return () => {
    window.removeEventListener('scroll', handleScroll);
    clearTimeout(scrollTimeout);
  };
};

/**
 * Preload de recursos críticos
 */
export const preloadCriticalResources = (urls = []) => {
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    
    if (url.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
      link.as = 'image';
    } else if (url.match(/\.(woff2|woff|ttf|eot)$/i)) {
      link.as = 'font';
      link.crossOrigin = 'anonymous';
    } else if (url.match(/\.(js)$/i)) {
      link.as = 'script';
    } else if (url.match(/\.(css)$/i)) {
      link.as = 'style';
    }
    
    link.href = url;
    document.head.appendChild(link);
  });
};
