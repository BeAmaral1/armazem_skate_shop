import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Mostrar botão quando rolar para baixo
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Scroll suave para o topo
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-4 md:bottom-28 md:right-6 z-50 bg-dark-900 hover:bg-dark-700 text-white p-2.5 md:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
          aria-label="Voltar ao topo"
          title="Voltar ao topo"
        >
          <ArrowUp className="w-5 h-5 md:w-6 md:h-6 group-hover:animate-bounce" />
        </button>
      )}
    </>
  );
};

export default BackToTop;
