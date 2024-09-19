// src/context/AuthContext.js

import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Création du contexte
const AuthContext = createContext();

// Fournisseur du contexte
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // État pour stocker les informations de l'utilisateur
  const navigate = useNavigate();

  // Fonction pour se connecter
  const login = (userData) => {
    setUser(userData);
    navigate('/'); // Redirection vers la page d'accueil après connexion
  };

  // Fonction pour se déconnecter
  const logout = () => {
    setUser(null);
    navigate('/'); // Redirection vers la page d'accueil après déconnexion
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
