// src/context/CartContext.jsx

import React, { createContext, useState, useContext } from 'react';

// Déclarez CartContext une seule fois
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Ajoutez ici vos fonctions pour gérer le panier
  const addToCart = (book, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === book.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === book.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...book, quantity }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      if (item.type === 'achat') {
        return total + (item.prixUnitaire * item.quantity);
      } else if (item.type === 'emprunt') {
        return total + (item.prixEmprunt * item.quantity);
      }
      return total;
    }, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    getTotalItems,
    getTotalPrice
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};