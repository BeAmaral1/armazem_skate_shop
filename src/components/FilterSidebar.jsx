import React, { useState } from 'react';
import {
  SlidersHorizontal,
  X,
  Star,
  Tag,
  Truck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const FilterSidebar = ({ filters, onFilterChange, onClearFilters }) => {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    category: true,
    brand: false,
    rating: false,
    features: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePriceChange = (type, value) => {
    onFilterChange('price', {
      ...filters.price,
      [type]: parseFloat(value),
    });
  };

  const handleCheckboxChange = (filterType, value) => {
    const current = filters[filterType] || [];
    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    onFilterChange(filterType, updated);
  };

  const handleRatingChange = (rating) => {
    onFilterChange('rating', filters.rating === rating ? null : rating);
  };

  const hasActiveFilters = () => {
    return (
      (filters.price.min > 0 || filters.price.max < 2000) ||
      (filters.categories && filters.categories.length > 0) ||
      (filters.brands && filters.brands.length > 0) ||
      filters.rating !== null ||
      filters.onSale ||
      filters.freeShipping
    );
  };

  const categories = ['Surf', 'Skate', 'Vestuário', 'Acessórios'];
  const brands = ['Rip Curl', 'Billabong', 'Quiksilver', 'Vans', 'Element', 'Oakley'];

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-dark-900 to-dark-700 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5" />
            <h3 className="font-bold text-lg">Filtros</h3>
          </div>
          {hasActiveFilters() && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1 text-sm hover:bg-white/20 px-3 py-1 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Limpar
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Price Range */}
        <div>
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full mb-3"
          >
            <h4 className="font-semibold text-gray-900">Preço</h4>
            {expandedSections.price ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.price && (
            <div className="space-y-4">
              <div>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="50"
                  value={filters.price.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-dark-900"
                />
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span className="text-gray-600">Mínimo</span>
                  <span className="font-semibold text-dark-900">
                    R$ {filters.price.min}
                  </span>
                </div>
              </div>

              <div>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="50"
                  value={filters.price.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-dark-900"
                />
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span className="text-gray-600">Máximo</span>
                  <span className="font-semibold text-dark-900">
                    R$ {filters.price.max}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Faixa: <span className="font-semibold text-gray-900">
                    R$ {filters.price.min} - R$ {filters.price.max}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-6"></div>

        {/* Categories */}
        <div>
          <button
            onClick={() => toggleSection('category')}
            className="flex items-center justify-between w-full mb-3"
          >
            <h4 className="font-semibold text-gray-900">Categoria</h4>
            {expandedSections.category ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          {expandedSections.category && (
            <div className="space-y-2">
              {categories.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filters.categories?.includes(category) || false}
                    onChange={() => handleCheckboxChange('categories', category)}
                    className="w-4 h-4 text-dark-900 border-gray-300 rounded focus:ring-dark-600"
                  />
                  <span className="text-sm text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-6"></div>

        {/* Brands */}
        <div>
          <button
            onClick={() => toggleSection('brand')}
            className="flex items-center justify-between w-full mb-3"
          >
            <h4 className="font-semibold text-gray-900">Marca</h4>
            {expandedSections.brand ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          {expandedSections.brand && (
            <div className="space-y-2">
              {brands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filters.brands?.includes(brand) || false}
                    onChange={() => handleCheckboxChange('brands', brand)}
                    className="w-4 h-4 text-dark-900 border-gray-300 rounded focus:ring-dark-600"
                  />
                  <span className="text-sm text-gray-700">{brand}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-6"></div>

        {/* Rating */}
        <div>
          <button
            onClick={() => toggleSection('rating')}
            className="flex items-center justify-between w-full mb-3"
          >
            <h4 className="font-semibold text-gray-900">Avaliação</h4>
            {expandedSections.rating ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          {expandedSections.rating && (
            <div className="space-y-2">
              {[5, 4, 3].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingChange(rating)}
                  className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors ${
                    filters.rating === rating
                      ? 'bg-dark-900 text-white'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rating
                            ? filters.rating === rating
                              ? 'fill-white text-white'
                              : 'fill-gray-400 text-gray-400'
                            : filters.rating === rating
                            ? 'text-white'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm">ou mais</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-6"></div>

        {/* Features */}
        <div>
          <button
            onClick={() => toggleSection('features')}
            className="flex items-center justify-between w-full mb-3"
          >
            <h4 className="font-semibold text-gray-900">Recursos</h4>
            {expandedSections.features ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          {expandedSections.features && (
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <input
                  type="checkbox"
                  checked={filters.onSale || false}
                  onChange={(e) => onFilterChange('onSale', e.target.checked)}
                  className="w-4 h-4 text-dark-900 border-gray-300 rounded focus:ring-dark-600"
                />
                <Tag className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Em Promoção</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <input
                  type="checkbox"
                  checked={filters.freeShipping || false}
                  onChange={(e) => onFilterChange('freeShipping', e.target.checked)}
                  className="w-4 h-4 text-dark-900 border-gray-300 rounded focus:ring-dark-600"
                />
                <Truck className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Frete Grátis</span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
