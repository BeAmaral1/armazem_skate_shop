import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import WishlistButton from './WishlistButton';
import LazyImage from './LazyImage';
import { optimizeProductCard } from '../utils/imageOptimizer';

const ProductCard = memo(({ product }) => {
  const discount = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <div className="card group flex flex-col h-full">
      {/* Image */}
      <Link to={`/produto/${product.id}`} className="relative overflow-hidden aspect-square block">
        <LazyImage
          src={optimizeProductCard(product.image)}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Wishlist Button */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <WishlistButton product={product} size="md" />
        </div>
        {discount > 0 && (
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-dark-600 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-bold">
            -{discount}%
          </div>
        )}
        {product.featured && product.stock > 0 && (
          <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-dark-600 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-bold">
            Destaque
          </div>
        )}
        {/* Badge Fora de Estoque */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm sm:text-base">
              FORA DE ESTOQUE
            </div>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">
            {product.category}
          </div>
          <Link to={`/produto/${product.id}`}>
            <h3 className="font-semibold text-base text-gray-900 mb-3 line-clamp-2 hover:text-dark-600 transition-colors" style={{ lineHeight: '1.4', minHeight: '2.8rem' }}>
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center mb-3">
            {product.rating && (
              <>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-gray-500 text-gray-500'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">
                  ({product.reviews?.length || 0})
                </span>
              </>
            )}
          </div>
        </div>

        <div>
          {/* Price */}
          <div className="mb-4">
            {product.oldPrice && (
              <div className="text-sm text-gray-400 line-through mb-1">
                R$ {product.oldPrice.toFixed(2).replace('.', ',')}
              </div>
            )}
            <div className="text-2xl font-bold text-dark-600">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </div>
          </div>

          {/* Button */}
          <Link
            to={`/produto/${product.id}`}
            className={`w-full font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-xs ${
              product.stock === 0
                ? 'bg-gray-400 text-gray-700 cursor-default'
                : 'bg-dark-600 hover:bg-dark-700 text-white group-hover:shadow-lg'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            {product.stock === 0 ? 'Indisponível' : 'Ver Detalhes'}
          </Link>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
