import React, { createContext, useState, useContext } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Fonction pour ajouter un livre au panier
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

  // Fonction pour retirer un livre du panier
  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  // Fonction pour mettre à jour la quantité d'un livre dans le panier
  const updateQuantity = (id, newQuantity) => {
    setCart(prevCart => prevCart.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  // Fonction pour vider le panier
  const clearCart = () => {
    setCart([]);
  };

  // Fonction pour calculer le nombre total d'articles dans le panier
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Fonction pour calculer le prix total des articles dans le panier
  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price);  // Utilisation de 'price' au lieu de 'prixUnitaire'
      if (isNaN(price)) {
        console.error(`Prix invalide pour l'article ${item.id}`);
        return total;
      }
      return total + (price * item.quantity);  // Calcul du prix total pour chaque item
    }, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Hook personnalisé pour accéder au contexte du panier
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
