import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    // Carregar do localStorage ao iniciar
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Salvar no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Adicionar produto aos favoritos
  const addToWishlist = (product) => {
    setWishlist((prev) => {
      // Verificar se já está na lista
      if (prev.find((item) => item.id === product.id)) {
        return prev;
      }
      return [...prev, { ...product, addedAt: new Date().toISOString() }];
    });
  };

  // Remover produto dos favoritos
  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  // Verificar se produto está nos favoritos
  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  // Toggle (adicionar/remover)
  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Limpar todos os favoritos
  const clearWishlist = () => {
    setWishlist([]);
  };

  // Contar itens
  const getWishlistCount = () => {
    return wishlist.length;
  };

  // Mover para o carrinho (integração futura)
  const moveToCart = (productId, addToCart) => {
    const product = wishlist.find((item) => item.id === productId);
    if (product && addToCart) {
      addToCart(product);
      removeFromWishlist(productId);
    }
  };

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    clearWishlist,
    getWishlistCount,
    moveToCart,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
