import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Création du contexte Auth pour gérer l'état de l'utilisateur
const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

// Fournisseur du contexte d'authentification
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // État pour stocker l'utilisateur connecté
  const navigate = useNavigate();  // Navigateur pour les redirections

  // Charger les informations de l'utilisateur depuis localStorage au montage du composant
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);  // Restaurer l'utilisateur si les informations existent
    }
  }, []);

  // Fonction pour se connecter
  const login = async (userData) => {
    try {
      // Stocker les informations de l'utilisateur dans localStorage
      localStorage.setItem('user', JSON.stringify({
        token: userData.token,
        roles: userData.roles,
        nom: userData.nom,
        prenom: userData.prenom,
        photo: userData.photo,
      }));

      // Mettre à jour l'état avec les informations de l'utilisateur
      setUser(userData);
      navigate('/dashboard');  // Rediriger vers le tableau de bord après connexion
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
    }
  };

  // Fonction pour s'inscrire
  const signup = async (userData) => {
    await login(userData); // Se connecter directement après l'inscription
  };

  // Fonction pour se déconnecter
  const logout = () => {
    localStorage.removeItem('user');  // Supprimer les informations de l'utilisateur
    setUser(null);  // Réinitialiser l'état utilisateur
    navigate('/');  // Rediriger vers la page d'accueil
  };

  // Fournir les données et fonctions via le contexte
  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
