import React, { useState } from 'react';
import { ThumbsUp, CheckCircle, Image as ImageIcon } from 'lucide-react';
import StarRating from './StarRating';
import { useReviews } from '../context/ReviewsContext';
import { useAuth } from '../context/AuthContext';

const ReviewCard = ({ review }) => {
  const { markAsHelpful, isMarkedAsHelpful } = useReviews();
  const { user } = useAuth();
  const [showAllImages, setShowAllImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const isHelpful = isMarkedAsHelpful(review.id);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleHelpful = () => {
    if (!user) {
      alert('Você precisa estar logado para marcar como útil');
      return;
    }
    markAsHelpful(review.id);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-sm">
                {getInitials(review.userName)}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900">{review.userName}</span>
                {review.verified && (
                  <div className="flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    <span className="font-medium">Compra Verificada</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500">{formatDate(review.date)}</p>
            </div>
          </div>

          {/* Rating */}
          <StarRating rating={review.rating} size="sm" readOnly />
        </div>

        {/* Title */}
        {review.title && (
          <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
        )}

        {/* Comment */}
        <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>

        {/* Images */}
        {review.images && review.images.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              {(showAllImages ? review.images : review.images.slice(0, 3)).map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleImageClick(image)}
                  className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-dark-900 transition-colors"
                >
                  <img
                    src={image}
                    alt={`Review ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
              {review.images.length > 3 && !showAllImages && (
                <button
                  onClick={() => setShowAllImages(true)}
                  className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:text-dark-900 hover:border-dark-900 transition-colors"
                >
                  <ImageIcon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">+{review.images.length - 3}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            onClick={handleHelpful}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isHelpful
                ? 'bg-dark-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${isHelpful ? 'fill-current' : ''}`} />
            <span>Útil ({review.helpful})</span>
          </button>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          <button
            onClick={closeImageModal}
            className="absolute top-4 right-4 text-white text-4xl font-light hover:text-gray-300 transition-colors"
          >
            ×
          </button>
          <img
            src={selectedImage}
            alt="Review"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default ReviewCard;
