import React, { useState } from 'react';
import { Star, X, Loader, Image as ImageIcon } from 'lucide-react';
import StarRating from './StarRating';
import { useReviews } from '../context/ReviewsContext';
import { useAuth } from '../context/AuthContext';
import Toast from './Toast';

const ReviewForm = ({ productId, onSuccess }) => {
  const { addReview } = useReviews();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: '',
    images: [],
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (formData.rating === 0) {
      newErrors.rating = 'Selecione uma avaliação';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!formData.comment.trim()) {
      newErrors.comment = 'Comentário é obrigatório';
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = 'Comentário deve ter no mínimo 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setToast({
        type: 'error',
        message: {
          title: '❌ Erro',
          description: 'Você precisa estar logado para avaliar',
        },
      });
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    const result = await addReview({
      productId,
      ...formData,
    });

    setLoading(false);

    if (result.success) {
      setToast({
        type: 'success',
        message: {
          title: '✅ Avaliação Enviada!',
          description: 'Sua avaliação foi publicada com sucesso.',
        },
      });

      // Resetar formulário
      setFormData({
        rating: 0,
        title: '',
        comment: '',
        images: [],
      });
      setErrors({});

      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500);
      }
    } else {
      setToast({
        type: 'error',
        message: {
          title: '❌ Erro',
          description: result.error,
        },
      });
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Simular upload - em produção, fazer upload real
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...imageUrls].slice(0, 5), // Máximo 5 imagens
    }));
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-xl font-heading font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Star className="w-6 h-6" />
          Escrever Avaliação
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sua Avaliação *
            </label>
            <StarRating
              rating={formData.rating}
              onChange={(rating) => {
                setFormData({ ...formData, rating });
                setErrors({ ...errors, rating: '' });
              }}
              size="xl"
            />
            {errors.rating && (
              <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título da Avaliação *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                setErrors({ ...errors, title: '' });
              }}
              disabled={loading}
              className={`input-field ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Resuma sua experiência"
              maxLength={100}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seu Comentário *
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => {
                setFormData({ ...formData, comment: e.target.value });
                setErrors({ ...errors, comment: '' });
              }}
              disabled={loading}
              className={`input-field min-h-[120px] ${errors.comment ? 'border-red-500' : ''}`}
              placeholder="Conte-nos sobre sua experiência com este produto..."
              maxLength={1000}
            />
            <div className="flex items-center justify-between mt-1">
              {errors.comment ? (
                <p className="text-sm text-red-600">{errors.comment}</p>
              ) : (
                <p className="text-xs text-gray-500">Mínimo 10 caracteres</p>
              )}
              <p className="text-xs text-gray-500">{formData.comment.length}/1000</p>
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fotos (Opcional)
            </label>
            
            {/* Preview Images */}
            {formData.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative w-20 h-20">
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            {formData.images.length < 5 && (
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 cursor-pointer transition-colors">
                <ImageIcon className="w-5 h-5" />
                <span>Adicionar Fotos</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={loading}
                />
              </label>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Máximo 5 fotos • JPG, PNG ou GIF
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center justify-center gap-2 flex-1"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Star className="w-5 h-5" />
                  Publicar Avaliação
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ReviewForm;
