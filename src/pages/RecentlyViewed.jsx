import React, { useState } from 'react';
import { Eye, X, Trash2, Calendar, Tag } from 'lucide-react';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import ProductCard from '../components/ProductCard';
import ProfileSidebar from '../components/ProfileSidebar';

const RecentlyViewed = () => {
  const {
    getRecentlyViewed,
    getCount,
    removeProduct,
    clearAll,
    getRelativeTime,
    getByCategory,
  } = useRecentlyViewed();

  const [filter, setFilter] = useState('all'); // all, surf, skate, vestuario, acessorios
  const [showClearModal, setShowClearModal] = useState(false);
  const allProducts = getRecentlyViewed();
  const totalCount = getCount();

  // Aplicar filtro
  const getFilteredProducts = () => {
    if (filter === 'all') return allProducts;
    return getByCategory(filter);
  };

  const filteredProducts = getFilteredProducts();

  // Contar por categoria
  const getCategoryCount = (category) => {
    if (category === 'all') return totalCount;
    return getByCategory(category).length;
  };

  const filters = [
    { value: 'all', label: 'Todos', icon: Eye },
    { value: 'Surf', label: 'Surf', icon: Tag },
    { value: 'Skate', label: 'Skate', icon: Tag },
    { value: 'Vestuário', label: 'Vestuário', icon: Tag },
    { value: 'Acessórios', label: 'Acessórios', icon: Tag },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-2 flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                Produtos Recentemente Vistos
              </h1>
              <p className="text-gray-600">
                {totalCount === 0
                  ? 'Você ainda não visualizou nenhum produto'
                  : `${totalCount} ${totalCount === 1 ? 'produto visto' : 'produtos vistos'}`}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ProfileSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {totalCount > 0 && (
              <>
                {/* Filters */}
                <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Filtrar por Categoria</h3>
                    <button
                      onClick={() => setShowClearModal(true)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Limpar Tudo
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                    {filters.map((f) => {
                      const Icon = f.icon;
                      const count = getCategoryCount(f.value);
                      
                      return (
                        <button
                          key={f.value}
                          onClick={() => setFilter(f.value)}
                          disabled={count === 0 && f.value !== 'all'}
                          className={`p-3 rounded-lg border-2 transition-all text-center ${
                            filter === f.value
                              ? 'border-purple-500 bg-purple-50'
                              : count === 0 && f.value !== 'all'
                              ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                              : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                          }`}
                        >
                          <Icon
                            className={`w-5 h-5 mx-auto mb-1 ${
                              filter === f.value ? 'text-purple-600' : 'text-gray-600'
                            }`}
                          />
                          <p className="text-xs font-medium text-gray-900 mb-1">{f.label}</p>
                          <p
                            className={`text-sm font-bold ${
                              filter === f.value ? 'text-purple-600' : 'text-gray-600'
                            }`}
                          >
                            {count}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Products Grid */}
                {filteredProducts.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Nenhum produto encontrado
                    </h3>
                    <p className="text-gray-600">
                      {filter === 'all'
                        ? 'Você ainda não visualizou nenhum produto'
                        : `Nenhum produto da categoria ${filter} visualizado`}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="relative group">
                        {/* Remove Button */}
                        <button
                          onClick={() => removeProduct(product.id)}
                          className="absolute top-2 right-2 z-20 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                          title="Remover do histórico"
                        >
                          <X className="w-5 h-5 text-gray-600 hover:text-red-600" />
                        </button>

                        {/* Viewed Time Badge */}
                        <div className="absolute top-2 left-2 z-20 bg-purple-500 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                          <Calendar className="w-3 h-3" />
                          {getRelativeTime(product.viewedAt)}
                        </div>

                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Empty State */}
            {totalCount === 0 && (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <Eye className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  Nenhum Produto Visualizado
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Quando você visualizar produtos, eles aparecerão aqui para facilitar o acesso
                  posterior.
                </p>
                <a
                  href="/produtos"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  Explorar Produtos
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Confirmação */}
      {showClearModal && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-50 animate-fadeIn"
            onClick={() => setShowClearModal(false)}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-slideUp"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Limpar Histórico?
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Esta ação não pode ser desfeita
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-700 leading-relaxed">
                  Você está prestes a remover <strong className="text-gray-900">{totalCount} {totalCount === 1 ? 'produto' : 'produtos'}</strong> do
                  seu histórico de visualizações. Deseja continuar?
                </p>
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                  <Eye className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    Você perderá o acesso rápido a todos os produtos que visualizou recentemente.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 border-t border-gray-200 flex gap-3">
                <button
                  onClick={() => setShowClearModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    clearAll();
                    setShowClearModal(false);
                  }}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Limpar Tudo
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RecentlyViewed;
