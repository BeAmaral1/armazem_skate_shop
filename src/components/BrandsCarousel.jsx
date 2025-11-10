import React from 'react';
import { Waves, Zap, Flame, Glasses, Backpack, Star, Leaf, Wind } from 'lucide-react';

const BrandsCarousel = () => {
  const brands = [
    { name: 'Ocean Soul', icon: Waves },
    { name: 'Street Surf Co.', icon: Wind },
    { name: 'Independent', icon: Zap },
    { name: 'Spitfire', icon: Flame },
    { name: 'Wave Vision', icon: Glasses },
    { name: 'Wave Gear', icon: Backpack },
    { name: 'Armazém', icon: Star },
    { name: 'Eco Surf', icon: Leaf },
  ];

  // Duplicar para efeito infinito
  const duplicatedBrands = [...brands, ...brands, ...brands];

  return (
    <section className="py-8 sm:py-12 bg-white border-y border-gray-200 overflow-hidden">
      <div className="container mx-auto px-4 mb-6">
        <h3 className="text-center text-sm sm:text-base font-semibold text-gray-600 uppercase tracking-wider">
          Marcas Parceiras
        </h3>
      </div>

      {/* Carrossel infinito */}
      <div className="relative">
        {/* Gradiente esquerda */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
        
        {/* Gradiente direita */}
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10"></div>

        {/* Faixa de marcas */}
        <div className="flex animate-scroll-brands">
          {duplicatedBrands.map((brand, index) => {
            const Icon = brand.icon;
            return (
              <div
                key={`${brand.name}-${index}`}
                className="flex-shrink-0 mx-4 sm:mx-8 flex flex-col items-center justify-center group"
              >
                {/* Logo (ícone) */}
                <div className="mb-2 group-hover:scale-110 transition-transform text-gray-700">
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                
                {/* Nome da marca */}
                <span className="text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                  {brand.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BrandsCarousel;
