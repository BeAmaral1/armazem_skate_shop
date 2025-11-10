import React, { useRef, useState, useEffect } from 'react';
import { RefreshCw, Truck, Shield, CreditCard } from 'lucide-react';

const InfoBanner = () => {
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const features = [
    {
      icon: RefreshCw,
      title: 'Trocas e Devoluções',
      description: 'Em até 30 dias após a compra'
    },
    {
      icon: Truck,
      title: 'Frete Grátis',
      description: 'Para compras acima de R$ 299'
    },
    {
      icon: Shield,
      title: 'Compra Segura',
      description: 'Seus dados protegidos'
    },
    {
      icon: CreditCard,
      title: 'Parcele sem Juros',
      description: 'Em até 10x no cartão'
    }
  ];

  // Carrossel automático apenas em mobile
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (!isMobile) return; // Não executa em desktop

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % features.length;
        const container = scrollContainerRef.current;
        if (container) {
          const cardWidth = container.scrollWidth / features.length;
          container.scrollTo({
            left: cardWidth * nextIndex,
            behavior: 'smooth'
          });
        }
        return nextIndex;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [features.length]);

  // Handlers para arrastar com mouse (apenas mobile)
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
    const walk = (x - startX) * 2;
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

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Desktop: Grid | Mobile: Carrossel */}
        <div className="relative">
          {/* Features Container */}
          <div
            ref={scrollContainerRef}
            className="md:grid md:grid-cols-4 md:gap-8 lg:gap-12 flex md:overflow-visible overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory gap-6 select-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', cursor: 'default' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center flex-shrink-0 w-full snap-center md:w-auto"
                >
                  {/* Ícone sem gradiente */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mb-3 sm:mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-900" />
                  </div>
                  
                  {/* Título */}
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-1">
                    {feature.title}
                  </h3>
                  
                  {/* Descrição */}
                  <p className="text-xs sm:text-sm text-gray-900">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoBanner;
