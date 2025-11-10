import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Waves, Wind, Shirt, Package } from 'lucide-react';

const CategoryCarousel = () => {
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const categories = [
    {
      name: 'Surf',
      icon: Waves,
      image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&q=80',
      gradient: 'from-blue-400 to-cyan-500'
    },
    {
      name: 'Skate',
      icon: Wind,
      image: 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=400&q=80',
      gradient: 'from-orange-400 to-red-500'
    },
    {
      name: 'Vestuário',
      icon: Shirt,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80',
      gradient: 'from-purple-400 to-pink-500'
    },
    {
      name: 'Acessórios',
      icon: Package,
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80',
      gradient: 'from-green-400 to-emerald-500'
    },
    {
      name: 'Pranchas',
      icon: Waves,
      image: 'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=400&q=80',
      gradient: 'from-indigo-400 to-blue-500'
    },
    {
      name: 'Shapes',
      icon: Wind,
      image: 'https://images.unsplash.com/photo-1564982752979-3f7bc974c9a5?w=400&q=80',
      gradient: 'from-yellow-400 to-orange-500'
    }
  ];

  // Handlers para arrastar com mouse
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
    <section className="pt-8 pb-3 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-2">
            Explore por Categoria
          </h2>
          <p className="text-gray-600">Encontre exatamente o que você precisa</p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Categories Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-8 sm:gap-12 lg:gap-16 overflow-x-auto scrollbar-hide pt-4 pb-2 px-8 sm:px-12 lg:px-16 select-none justify-start md:justify-center"
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
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/produtos?categoria=${category.name}`}
                className="group/item flex flex-col items-center flex-shrink-0"
              >
                {/* Círculo com imagem - Tamanhos maiores */}
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 mb-4">
                  {/* Anel gradiente externo */}
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${category.gradient} p-0.5 transition-all duration-300`}>
                    {/* Círculo interno branco */}
                    <div className="w-full h-full rounded-full bg-white p-0.5">
                      {/* Imagem circular */}
                      <div className="w-full h-full rounded-full overflow-hidden">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-105"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Efeito de brilho ao hover - removido para evitar corte */}
                </div>
                
                {/* Nome da categoria */}
                <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover/item:text-dark-600 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryCarousel;
