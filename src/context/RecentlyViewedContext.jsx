import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const RecentlyViewedContext = createContext();

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider');
  }
  return context;
};

const MAX_RECENTLY_VIEWED = 12; // Limite de produtos no histórico

export const RecentlyViewedProvider = ({ children }) => {
  const { user } = useAuth();
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Carregar produtos do localStorage
  useEffect(() => {
    const storageKey = user ? `recently_viewed_${user.id}` : 'recently_viewed_guest';
    const saved = localStorage.getItem(storageKey);
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Converter timestamps de volta para Date
        const withDates = parsed.map((item) => ({
          ...item,
          viewedAt: new Date(item.viewedAt),
        }));
        setRecentlyViewed(withDates);
      } catch (error) {
        console.error('Erro ao carregar produtos recentes:', error);
        setRecentlyViewed([]);
      }
    }
  }, [user]);

  // Salvar no localStorage
  const saveToStorage = (items) => {
    const storageKey = user ? `recently_viewed_${user.id}` : 'recently_viewed_guest';
    localStorage.setItem(storageKey, JSON.stringify(items));
    setRecentlyViewed(items);
  };

  // Adicionar produto ao histórico
  const addProduct = (product) => {
    if (!product || !product.id) return;

    // Criar item com timestamp
    const viewedItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      image: product.image,
      category: product.category,
      rating: product.rating,
      reviews: product.reviews,
      inStock: product.inStock,
      viewedAt: new Date(),
    };

    // Remover produto se já existe (para mover para o topo)
    const filtered = recentlyViewed.filter((item) => item.id !== product.id);

    // Adicionar no início e limitar ao máximo
    const updated = [viewedItem, ...filtered].slice(0, MAX_RECENTLY_VIEWED);

    saveToStorage(updated);
  };

  // Buscar todos os produtos recentes
  const getRecentlyViewed = () => {
    return recentlyViewed;
  };

  // Buscar N produtos mais recentes
  const getRecent = (limit = 6) => {
    return recentlyViewed.slice(0, limit);
  };

  // Remover produto específico
  const removeProduct = (productId) => {
    const filtered = recentlyViewed.filter((item) => item.id !== productId);
    saveToStorage(filtered);
  };

  // Limpar todo o histórico
  const clearAll = () => {
    saveToStorage([]);
  };

  // Verificar se produto foi visto
  const hasViewed = (productId) => {
    return recentlyViewed.some((item) => item.id === productId);
  };

  // Contar produtos no histórico
  const getCount = () => {
    return recentlyViewed.length;
  };

  // Formatar tempo relativo
  const getRelativeTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
      });
    } else if (days > 0) {
      return `${days} ${days === 1 ? 'dia' : 'dias'} atrás`;
    } else if (hours > 0) {
      return `${hours}h atrás`;
    } else if (minutes > 0) {
      return `${minutes}min atrás`;
    } else {
      return 'Agora';
    }
  };

  // Buscar por categoria
  const getByCategory = (category) => {
    return recentlyViewed.filter((item) => item.category === category);
  };

  // Buscar produtos em estoque
  const getInStock = () => {
    return recentlyViewed.filter((item) => item.inStock !== false);
  };

  const value = {
    recentlyViewed,
    addProduct,
    getRecentlyViewed,
    getRecent,
    removeProduct,
    clearAll,
    hasViewed,
    getCount,
    getRelativeTime,
    getByCategory,
    getInStock,
    maxItems: MAX_RECENTLY_VIEWED,
  };

  return (
    <RecentlyViewedContext.Provider value={value}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};
