import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

const WishlistButton = ({ product, size = 'md', showLabel = false }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [animate, setAnimate] = useState(false);
  const isFavorite = isInWishlist(product.id);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    toggleWishlist(product);
    
    // Animação de pulse
    setAnimate(true);
    setTimeout(() => setAnimate(false), 300);
  };

  if (showLabel) {
    // Versão com label (botão completo)
    return (
      <button
        onClick={handleClick}
        className={`
          w-full py-3 px-6
          ${isFavorite 
            ? 'bg-dark-900 text-white border-dark-900' 
            : 'bg-white text-gray-900 border-gray-300 hover:border-dark-900'
          }
          ${animate ? 'animate-pulse scale-105' : ''}
          flex items-center justify-center gap-2
          rounded-lg
          border-2
          transition-all duration-300
          shadow-md hover:shadow-lg
          font-medium
        `}
        title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        <Heart
          className={`
            w-5 h-5
            transition-all duration-300
            ${isFavorite ? 'fill-current' : ''}
          `}
        />
        <span className="text-sm sm:text-base">
          {isFavorite ? 'Favoritado' : 'Favoritar'}
        </span>
      </button>
    );
  }

  // Versão ícone apenas (circular)
  return (
    <button
      onClick={handleClick}
      className={`
        ${sizeClasses[size]}
        ${isFavorite 
          ? 'bg-dark-900 text-white' 
          : 'bg-white text-gray-600 hover:text-dark-900'
        }
        ${animate ? 'animate-pulse scale-110' : ''}
        flex items-center justify-center
        rounded-full
        border-2
        ${isFavorite ? 'border-dark-900' : 'border-gray-300'}
        transition-all duration-300
        shadow-md hover:shadow-lg
        group
      `}
      title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <Heart
        className={`
          ${iconSizes[size]}
          transition-all duration-300
          ${isFavorite ? 'fill-current' : 'group-hover:scale-110'}
        `}
      />
    </button>
  );
};

export default WishlistButton;
