import React, { useState, useEffect } from 'react';
import { Search, HelpCircle, TrendingUp, Star, MessageCircle } from 'lucide-react';
import { useFAQ } from '../context/FAQContext';
import FAQAccordion from '../components/FAQAccordion';

const FAQ = () => {
  const {
    getAllFAQs,
    getByCategory,
    searchFAQs,
    getMostViewed,
    getMostHelpful,
    getCategories,
  } = useFAQ();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredFAQs, setFilteredFAQs] = useState([]);
  const [showMostViewed, setShowMostViewed] = useState(true);

  const categories = getCategories();
  const allFAQs = getAllFAQs();
  const mostViewed = getMostViewed(5);
  const mostHelpful = getMostHelpful(5);

  // Aplicar filtros
  useEffect(() => {
    let result = allFAQs;

    // Filtrar por categoria
    if (selectedCategory !== 'all') {
      result = getByCategory(selectedCategory);
    }

    // Filtrar por busca
    if (searchQuery.trim()) {
      result = searchFAQs(searchQuery);
    }

    setFilteredFAQs(result);
  }, [searchQuery, selectedCategory]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-dark-900 to-dark-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-8 h-8" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-4">
              Como podemos ajudar?
            </h1>
            <p className="text-lg text-gray-200 mb-8">
              Encontre respostas rápidas para as perguntas mais frequentes
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Buscar por pergunta, palavra-chave..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-300 focus:border-dark-600 focus:outline-none text-gray-900 text-lg"
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8 max-w-xl mx-auto">
              <div className="text-center">
                <p className="text-3xl font-bold">{allFAQs.length}</p>
                <p className="text-sm text-gray-300">Perguntas</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">{categories.length}</p>
                <p className="text-sm text-gray-300">Categorias</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">24/7</p>
                <p className="text-sm text-gray-300">Disponível</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Categorias</h3>
              
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-dark-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Todas</span>
                    <span
                      className={`text-sm ${
                        selectedCategory === 'all' ? 'text-white' : 'text-gray-500'
                      }`}
                    >
                      {allFAQs.length}
                    </span>
                  </div>
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedCategory === cat.name
                        ? 'bg-dark-900 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{cat.name}</span>
                      <span
                        className={`text-sm ${
                          selectedCategory === cat.name
                            ? 'text-white'
                            : 'text-gray-500'
                        }`}
                      >
                        {cat.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Quick Links */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">
                  Links Rápidos
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setShowMostViewed(true)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      showMostViewed
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Mais Vistas
                    </div>
                  </button>
                  <button
                    onClick={() => setShowMostViewed(false)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      !showMostViewed
                        ? 'bg-yellow-50 text-yellow-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Mais Úteis
                    </div>
                  </button>
                </div>
              </div>

              {/* Contact Support */}
              <div className="mt-6 p-4 bg-gradient-to-br from-dark-900 to-dark-700 rounded-lg text-white">
                <MessageCircle className="w-8 h-8 mb-2" />
                <h4 className="font-semibold mb-1">Precisa de ajuda?</h4>
                <p className="text-xs text-gray-200 mb-3">
                  Nossa equipe está pronta para te ajudar
                </p>
                <a
                  href="/contato"
                  className="block w-full text-center py-2 bg-white text-dark-900 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Falar com Suporte
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Active Filters */}
            {(searchQuery || selectedCategory !== 'all') && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-700 font-medium">
                      Filtros ativos:
                    </span>
                    {searchQuery && (
                      <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 border border-gray-300">
                        Busca: "{searchQuery}"
                      </span>
                    )}
                    {selectedCategory !== 'all' && (
                      <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 border border-gray-300">
                        Categoria: {selectedCategory}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Limpar Filtros
                  </button>
                </div>
              </div>
            )}

            {/* Results Count */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {searchQuery
                  ? `Resultados da busca (${filteredFAQs.length})`
                  : selectedCategory === 'all'
                  ? 'Todas as Perguntas'
                  : `${selectedCategory} (${filteredFAQs.length})`}
              </h2>
            </div>

            {/* FAQ List */}
            {filteredFAQs.length > 0 ? (
              <FAQAccordion faqs={filteredFAQs} showFeedback={true} showViews={true} />
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhuma pergunta encontrada
                </h3>
                <p className="text-gray-600 mb-6">
                  Não encontramos perguntas que correspondam aos seus critérios de busca.
                </p>
                <button
                  onClick={clearFilters}
                  className="btn-primary"
                >
                  Limpar Filtros
                </button>
              </div>
            )}

            {/* Most Viewed / Most Helpful */}
            {!searchQuery && selectedCategory === 'all' && (
              <div className="mt-12">
                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={() => setShowMostViewed(true)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      showMostViewed
                        ? 'bg-dark-900 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Mais Vistas
                    </div>
                  </button>
                  <button
                    onClick={() => setShowMostViewed(false)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      !showMostViewed
                        ? 'bg-dark-900 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Mais Úteis
                    </div>
                  </button>
                </div>

                <FAQAccordion
                  faqs={showMostViewed ? mostViewed : mostHelpful}
                  showFeedback={true}
                  showViews={true}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
