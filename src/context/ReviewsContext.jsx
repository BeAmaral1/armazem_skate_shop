import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ReviewsContext = createContext();

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error('useReviews must be used within ReviewsProvider');
  }
  return context;
};

// Dados mockados de reviews
const MOCK_REVIEWS = [
  {
    id: 1,
    productId: 1,
    userId: 1,
    userName: 'João Silva',
    userAvatar: null,
    rating: 5,
    title: 'Excelente prancha!',
    comment: 'Comprei essa prancha há 3 meses e estou muito satisfeito. A qualidade é excelente, o acabamento é perfeito e o desempenho na água é incrível. Super recomendo para quem está começando ou já tem experiência.',
    date: '2024-10-15',
    verified: true,
    helpful: 12,
    images: [
      'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=400&fit=crop',
    ],
  },
  {
    id: 2,
    productId: 1,
    userId: 2,
    userName: 'Maria Santos',
    userAvatar: null,
    rating: 4,
    title: 'Muito boa, mas poderia melhorar',
    comment: 'A prancha é ótima, mas achei o preço um pouco alto. A entrega foi rápida e o produto veio bem embalado.',
    date: '2024-10-20',
    verified: true,
    helpful: 5,
    images: [],
  },
  {
    id: 3,
    productId: 1,
    userId: 3,
    userName: 'Pedro Costa',
    userAvatar: null,
    rating: 5,
    title: 'Perfeita para iniciantes!',
    comment: 'Estava procurando uma prancha para começar no surf e essa aqui foi perfeita! Muito estável e fácil de manobrar.',
    date: '2024-11-01',
    verified: false,
    helpful: 8,
    images: [],
  },
  {
    id: 4,
    productId: 2,
    userId: 1,
    userName: 'João Silva',
    userAvatar: null,
    rating: 5,
    title: 'Shape de alta qualidade',
    comment: 'Melhor shape que já tive! Resistente e com ótimo design.',
    date: '2024-10-25',
    verified: true,
    helpful: 15,
    images: [
      'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=400&h=400&fit=crop',
    ],
  },
  {
    id: 5,
    productId: 3,
    userId: 2,
    userName: 'Maria Santos',
    userAvatar: null,
    rating: 4,
    title: 'Rodas muito boas',
    comment: 'Rodas de qualidade, aderem bem ao chão. Recomendo!',
    date: '2024-11-02',
    verified: true,
    helpful: 3,
    images: [],
  },
];

export const ReviewsProvider = ({ children }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [userHelpful, setUserHelpful] = useState([]); // IDs dos reviews que o usuário marcou como útil

  // Carregar reviews do localStorage
  useEffect(() => {
    const savedHelpful = localStorage.getItem('userHelpful');
    if (savedHelpful) {
      setUserHelpful(JSON.parse(savedHelpful));
    }
  }, []);

  // Buscar reviews por produto
  const getReviewsByProduct = (productId) => {
    return reviews.filter((review) => review.productId === productId);
  };

  // Calcular estatísticas de reviews
  const getReviewStats = (productId) => {
    const productReviews = getReviewsByProduct(productId);
    const totalReviews = productReviews.length;

    if (totalReviews === 0) {
      return {
        average: 0,
        total: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        percentage: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const sum = productReviews.reduce((acc, review) => acc + review.rating, 0);
    const average = sum / totalReviews;

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    productReviews.forEach((review) => {
      distribution[review.rating]++;
    });

    const percentage = {};
    Object.keys(distribution).forEach((rating) => {
      percentage[rating] = (distribution[rating] / totalReviews) * 100;
    });

    return {
      average: Number(average.toFixed(1)),
      total: totalReviews,
      distribution,
      percentage,
    };
  };

  // Adicionar review
  const addReview = async (reviewData) => {
    try {
      if (!user) {
        return { success: false, error: 'Você precisa estar logado para avaliar' };
      }

      // Verificar se já avaliou este produto
      const hasReviewed = reviews.some(
        (review) => review.productId === reviewData.productId && review.userId === user.id
      );

      if (hasReviewed) {
        return { success: false, error: 'Você já avaliou este produto' };
      }

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newReview = {
        id: reviews.length + 1,
        userId: user.id,
        userName: user.name,
        userAvatar: null,
        date: new Date().toISOString().split('T')[0],
        verified: false, // Seria true se comprou o produto
        helpful: 0,
        images: reviewData.images || [],
        ...reviewData,
      };

      setReviews((prev) => [newReview, ...prev]);
      return { success: true, review: newReview };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Marcar review como útil
  const markAsHelpful = (reviewId) => {
    if (!user) return { success: false, error: 'Você precisa estar logado' };

    // Verificar se já marcou
    if (userHelpful.includes(reviewId)) {
      // Desmarcar
      const newHelpful = userHelpful.filter((id) => id !== reviewId);
      setUserHelpful(newHelpful);
      localStorage.setItem('userHelpful', JSON.stringify(newHelpful));

      setReviews((prev) =>
        prev.map((review) =>
          review.id === reviewId ? { ...review, helpful: review.helpful - 1 } : review
        )
      );

      return { success: true, marked: false };
    } else {
      // Marcar
      const newHelpful = [...userHelpful, reviewId];
      setUserHelpful(newHelpful);
      localStorage.setItem('userHelpful', JSON.stringify(newHelpful));

      setReviews((prev) =>
        prev.map((review) =>
          review.id === reviewId ? { ...review, helpful: review.helpful + 1 } : review
        )
      );

      return { success: true, marked: true };
    }
  };

  // Verificar se marcou como útil
  const isMarkedAsHelpful = (reviewId) => {
    return userHelpful.includes(reviewId);
  };

  // Filtrar reviews por rating
  const filterByRating = (productId, rating) => {
    const productReviews = getReviewsByProduct(productId);
    if (rating === 0) return productReviews;
    return productReviews.filter((review) => review.rating === rating);
  };

  // Ordenar reviews
  const sortReviews = (productReviews, sortBy) => {
    const sorted = [...productReviews];

    switch (sortBy) {
      case 'recent':
        return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'highest':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return sorted.sort((a, b) => a.rating - b.rating);
      case 'helpful':
        return sorted.sort((a, b) => b.helpful - a.helpful);
      default:
        return sorted;
    }
  };

  const value = {
    reviews,
    getReviewsByProduct,
    getReviewStats,
    addReview,
    markAsHelpful,
    isMarkedAsHelpful,
    filterByRating,
    sortReviews,
  };

  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
};
