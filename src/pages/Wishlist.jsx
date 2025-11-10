import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowRight, LogIn } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = (product) => {
    addToCart(product);
    // Opcional: remover dos favoritos após adicionar ao carrinho
    // removeFromWishlist(product.id);
  };

  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  // Redirecionar para login se não estiver autenticado
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12">
              <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full mb-6">
                <LogIn className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 mb-4">
                Faça login para ver seus favoritos
              </h1>
              <p className="text-gray-600 mb-8 text-sm sm:text-base">
                Entre na sua conta para acessar sua lista de produtos favoritos 💖
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/login" className="btn-primary inline-flex items-center justify-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Fazer Login
                </Link>
                <Link to="/produtos" className="btn-outline inline-flex items-center justify-center gap-2">
                  Explorar Produtos
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12">
              <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full mb-6">
                <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 mb-4">
                Sua lista de favoritos está vazia
              </h1>
              <p className="text-gray-600 mb-8 text-sm sm:text-base">
                Adicione produtos aos favoritos clicando no ícone de coração 💖
              </p>
              <Link to="/produtos" className="btn-primary inline-flex items-center gap-2">
                Explorar Produtos
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Heart className="w-8 h-8 fill-current text-dark-900" />
                Meus Favoritos
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                {wishlist.length} {wishlist.length === 1 ? 'produto' : 'produtos'} na sua lista
              </p>
            </div>
            {wishlist.length > 0 && (
              <button
                onClick={clearWishlist}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-dark-900 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Limpar Tudo
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
            >
              <Link to={`/produto/${product.id}`} className="block">
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {product.discount > 0 && (
                    <div className="absolute top-2 left-2 bg-dark-900 text-white text-xs font-bold px-2 py-1 rounded">
                      -{product.discount}%
                    </div>
                  )}
                  {product.isNew && (
                    <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded">
                      NOVO
                    </div>
                  )}
                  {/* Badge Fora de Estoque */}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm">
                        FORA DE ESTOQUE
                      </div>
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-4">
                <Link to={`/produto/${product.id}`}>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    {product.category}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-dark-700 transition-colors">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center gap-2 mb-4">
                  {product.discount > 0 && (
                    <span className="text-sm text-gray-400 line-through">
                      R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                    </span>
                  )}
                  <span className="text-lg font-bold text-dark-900">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 bg-dark-900 hover:bg-dark-950 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 text-sm"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Adicionar
                  </button>
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors duration-300"
                    title="Remover dos favoritos"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 sm:mt-12 text-center">
          <Link
            to="/produtos"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-dark-900 font-medium transition-colors"
          >
            Continuar Explorando
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
