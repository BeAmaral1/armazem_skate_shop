import React, { useState } from 'react';
import { Star, Filter, ChevronDown } from 'lucide-react';
import StarRating from './StarRating';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import { useReviews } from '../context/ReviewsContext';

const ReviewsSection = ({ productId }) => {
  const { getReviewsByProduct, getReviewStats, filterByRating, sortReviews } = useReviews();
  const [showForm, setShowForm] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortBy, setSortBy] = useState('recent');

  const allReviews = getReviewsByProduct(productId);
  const stats = getReviewStats(productId);
  
  // Aplicar filtros e ordenação
  const filteredReviews = filterByRating(productId, selectedRating);
  const sortedReviews = sortReviews(filteredReviews, sortBy);

  const sortOptions = [
    { value: 'recent', label: 'Mais Recentes' },
    { value: 'oldest', label: 'Mais Antigas' },
    { value: 'highest', label: 'Maior Avaliação' },
    { value: 'lowest', label: 'Menor Avaliação' },
    { value: 'helpful', label: 'Mais Úteis' },
  ];

  const handleFormSuccess = () => {
    setShowForm(false);
    // Scroll para as reviews
    document.getElementById('reviews-list')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-heading font-bold text-gray-900 flex items-center gap-3">
          <Star className="w-7 h-7 sm:w-8 sm:h-8" />
          Avaliações dos Clientes
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancelar' : 'Escrever Avaliação'}
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="animate-fadeIn">
          <ReviewForm productId={productId} onSuccess={handleFormSuccess} />
        </div>
      )}

      {/* Stats */}
      {stats.total > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Average Rating */}
            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {stats.average}
              </div>
              <StarRating rating={stats.average} size="lg" readOnly />
              <p className="text-sm text-gray-600 mt-2">
                Baseado em {stats.total} {stats.total === 1 ? 'avaliação' : 'avaliações'}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setSelectedRating(selectedRating === rating ? 0 : rating)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    selectedRating === rating
                      ? 'bg-dark-900 text-white'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star
                      className={`w-4 h-4 ${
                        selectedRating === rating
                          ? 'fill-white text-white'
                          : 'fill-yellow-400 text-yellow-400'
                      }`}
                    />
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        selectedRating === rating ? 'bg-white' : 'bg-dark-900'
                      }`}
                      style={{ width: `${stats.percentage[rating]}%` }}
                    />
                  </div>
                  <span
                    className={`text-sm font-medium w-12 text-right ${
                      selectedRating === rating ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    {stats.distribution[rating]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Seja o Primeiro a Avaliar!
          </h3>
          <p className="text-gray-600 mb-6">
            Nenhuma avaliação ainda. Compartilhe sua experiência com este produto.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Star className="w-5 h-5" />
            Escrever Primeira Avaliação
          </button>
        </div>
      )}

      {/* Filters and Sort */}
      {stats.total > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Filter Info */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {selectedRating > 0 ? (
                <>
                  Mostrando {filteredReviews.length}{' '}
                  {filteredReviews.length === 1 ? 'avaliação' : 'avaliações'} com{' '}
                  {selectedRating} {selectedRating === 1 ? 'estrela' : 'estrelas'}
                  <button
                    onClick={() => setSelectedRating(0)}
                    className="ml-2 text-dark-700 hover:text-dark-900 underline"
                  >
                    Limpar filtro
                  </button>
                </>
              ) : (
                <>Todas as avaliações ({stats.total})</>
              )}
            </span>
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-dark-900 cursor-pointer"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Reviews List */}
      {sortedReviews.length > 0 && (
        <div id="reviews-list" className="space-y-4">
          {sortedReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
