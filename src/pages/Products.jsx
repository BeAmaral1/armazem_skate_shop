import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, ChevronLeft, ChevronRight, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import SEO from '../components/SEO';
import { products, categories, brands } from '../data/products';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  
  const [filters, setFilters] = useState({
    price: { min: 0, max: 2000 },
    categories: [],
    brands: [],
    rating: null,
    onSale: false,
    freeShipping: false,
  });
  
  const [sortBy, setSortBy] = useState('featured');
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);

  // Handle initial category and subcategory from URL
  useEffect(() => {
    const categoria = searchParams.get('categoria');
    const subcategoria = searchParams.get('sub');
    
    if (categoria) {
      setActiveCategory(categoria);
    }
    if (subcategoria) {
      setActiveSubCategory(subcategoria);
    }
  }, [searchParams]);

  useEffect(() => {
    let result = [...products];

    // Filter by URL category (categoria principal)
    if (activeCategory) {
      const categoryMap = {
        'acessorios': 'Acessórios',
        'roupas': 'Vestuário',
        'tenis': 'Calçados'
      };
      const mappedCategory = categoryMap[activeCategory] || activeCategory;
      result = result.filter(p => 
        p.category.toLowerCase() === mappedCategory.toLowerCase()
      );
    }

    // Filter by URL subcategory (subcategoria)
    if (activeSubCategory && activeCategory) {
      // Filtrar por subcategoria se o produto tiver esse campo
      result = result.filter(p => {
        if (p.subcategory) {
          return p.subcategory.toLowerCase() === activeSubCategory.toLowerCase();
        }
        // Se não tiver subcategoria, manter todos da categoria
        return true;
      });
    }

    // Filter by search term
    const searchTerm = searchParams.get('busca');
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lowerSearch) ||
        p.description.toLowerCase().includes(lowerSearch) ||
        p.category.toLowerCase().includes(lowerSearch) ||
        p.brand.toLowerCase().includes(lowerSearch)
      );
    }

    // Filter by price range
    result = result.filter(p => 
      p.price >= filters.price.min && p.price <= filters.price.max
    );

    // Filter by categories (sidebar filters)
    if (filters.categories.length > 0 && !activeCategory) {
      result = result.filter(p => filters.categories.includes(p.category));
    }

    // Filter by brands
    if (filters.brands.length > 0) {
      result = result.filter(p => filters.brands.includes(p.brand));
    }

    // Filter by rating
    if (filters.rating !== null) {
      result = result.filter(p => p.rating >= filters.rating);
    }

    // Filter by on sale
    if (filters.onSale) {
      result = result.filter(p => p.oldPrice && p.oldPrice > p.price);
    }

    // Filter by free shipping (acima de R$299)
    if (filters.freeShipping) {
      result = result.filter(p => p.price >= 299);
    }

    // Sort products
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => b.id - a.id);
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, sortBy, searchParams]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      price: { min: 0, max: 2000 },
      categories: [],
      brands: [],
      rating: null,
      onSale: false,
      freeShipping: false,
    });
    setSortBy('featured');
    setSearchParams({});
  };

  const clearSearch = () => {
    setSearchParams({});
  };

  const activeSearch = searchParams.get('busca');

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <SEO 
        title="Produtos"
        description={`Confira nosso catálogo completo de ${filteredProducts.length} produtos de surf e skate. Melhores marcas e preços do Brasil.`}
      />
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          {/* Breadcrumb de Categoria */}
          {(activeCategory || activeSubCategory) && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <a href="/produtos" className="hover:text-dark-900 transition-colors">
                Todos os Produtos
              </a>
              {activeCategory && (
                <>
                  <span>›</span>
                  <span className="font-medium text-dark-900 capitalize">
                    {activeCategory}
                  </span>
                </>
              )}
              {activeSubCategory && (
                <>
                  <span>›</span>
                  <span className="font-medium text-dark-900 capitalize">
                    {activeSubCategory.replace('-', ' ')}
                  </span>
                </>
              )}
            </div>
          )}
          
          <h1 className="text-4xl font-heading font-bold text-gray-900 mb-2">
            {activeCategory ? (
              <span className="capitalize">{activeCategory}</span>
            ) : activeSearch ? (
              <>Resultados para "{activeSearch}"</>
            ) : (
              'Produtos'
            )}
            {activeSubCategory && (
              <span className="text-2xl text-gray-600 ml-2 capitalize">
                › {activeSubCategory.replace('-', ' ')}
              </span>
            )}
          </h1>
          
          {/* Filtros Ativos */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {activeSearch && (
              <div className="inline-flex items-center gap-2 bg-gray-100 text-dark-800 px-3 py-1.5 rounded-full">
                <span className="text-sm">Busca: <span className="font-medium">"{activeSearch}"</span></span>
                <button
                  onClick={clearSearch}
                  className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                  title="Limpar busca"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {(activeCategory || activeSubCategory) && (
              <button
                onClick={() => {
                  setActiveCategory(null);
                  setActiveSubCategory(null);
                  setSearchParams({});
                }}
                className="inline-flex items-center gap-2 bg-dark-900 text-white px-3 py-1.5 rounded-full hover:bg-dark-700 transition-colors"
              >
                <span className="text-sm font-medium">Limpar Filtro de Categoria</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          
          <p className="text-gray-600">
            {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-24">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Top bar */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-dark-900 text-white rounded-lg hover:bg-dark-950 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtros
              </button>

              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-gray-500" />
                  <label className="text-gray-700 text-sm font-medium">Ordenar por:</label>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-dark-600 focus:border-dark-600 bg-white"
                >
                  <option value="featured">Destaques</option>
                  <option value="newest">Mais Novos</option>
                  <option value="price-asc">Menor Preço</option>
                  <option value="price-desc">Maior Preço</option>
                  <option value="name">Nome (A-Z)</option>
                  <option value="rating">Melhor Avaliados</option>
                </select>
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  {filteredProducts
                    .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
                    .map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {/* Pagination */}
                {filteredProducts.length > productsPerPage && (
                  <div className="mt-12 flex justify-center">
                    <nav className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setCurrentPage(prev => Math.max(1, prev - 1));
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Página anterior"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, i) => i + 1)
                        .filter(page => {
                          const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
                          if (totalPages <= 7) return true;
                          if (page === 1 || page === totalPages) return true;
                          if (Math.abs(page - currentPage) <= 1) return true;
                          if (page === 2 && currentPage <= 3) return true;
                          if (page === totalPages - 1 && currentPage >= totalPages - 2) return true;
                          return false;
                        })
                        .map((page, index, array) => (
                          <React.Fragment key={page}>
                            {index > 0 && array[index - 1] !== page - 1 && (
                              <span className="px-2 text-gray-400">...</span>
                            )}
                            <button
                              onClick={() => {
                                setCurrentPage(page);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className={`min-w-[40px] h-10 px-4 rounded-lg font-medium transition-colors ${
                                currentPage === page
                                  ? 'bg-dark-600 text-white'
                                  : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                              }`}
                            >
                              {page}
                            </button>
                          </React.Fragment>
                        ))}

                      <button
                        onClick={() => {
                          setCurrentPage(prev => Math.min(Math.ceil(filteredProducts.length / productsPerPage), prev + 1));
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Próxima página"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg mb-4">
                  Nenhum produto encontrado com os filtros selecionados.
                </p>
                <button onClick={handleClearFilters} className="btn-primary">
                  Limpar Filtros
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
