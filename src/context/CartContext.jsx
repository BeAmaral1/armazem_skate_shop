import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('armazem-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('armazem-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, selectedSize, selectedColor) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(
        item => item.id === product.id && 
                item.selectedSize === selectedSize && 
                item.selectedColor === selectedColor
      );

      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevCart, { 
        ...product, 
        quantity: 1, 
        selectedSize, 
        selectedColor 
      }];
    });
  };

  const removeFromCart = (productId, selectedSize, selectedColor) => {
    setCart(prevCart =>
      prevCart.filter(
        item => !(item.id === productId && 
                  item.selectedSize === selectedSize && 
                  item.selectedColor === selectedColor)
      )
    );
  };

  const updateQuantity = (productId, selectedSize, selectedColor, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, selectedSize, selectedColor);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId && 
        item.selectedSize === selectedSize && 
        item.selectedColor === selectedColor
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
