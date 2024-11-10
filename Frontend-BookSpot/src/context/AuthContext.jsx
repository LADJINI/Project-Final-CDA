import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

/**
 * Contexte d'authentification pour gérer l'état de l'utilisateur.
 * @module AuthContext
 */

// Création du contexte Auth
const AuthContext = createContext();

/**
 * Hook personnalisé pour utiliser le contexte d'authentification.
 * @returns {Object} Le contexte d'authentification.
 * @throws {Error} Si le contexte est utilisé en dehors d'un AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

/**
 * Fournisseur du contexte d'authentification.
 * @param {Object} props - Les propriétés du composant.
 * @param {React.ReactNode} props.children - Les enfants à rendre.
 * @returns {JSX.Element} Le fournisseur de contexte.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser ] = useState(null); // État pour stocker l'utilisateur connecté
  const navigate = useNavigate(); // Navigateur pour les redirections

  // Charger les informations de l'utilisateur depuis les cookies au montage du composant
  useEffect(() => {
    const token = Cookies.get('token'); // Récupérer le token depuis le cookie
    if (token) {
      const storedUser  = JSON.parse(Cookies.get('user')); // Récupérer les informations utilisateur
      setUser (storedUser ); // Restaurer l'utilisateur si les informations existent
    }
  }, []);

  /**
   * Fonction pour se connecter.
   * @param {Object} userData - Les données de l'utilisateur.
   */
  const login = async (userData) => {
    try {
      // Stocker les informations de l'utilisateur dans des cookies
      Cookies.set('token', userData.token, { secure: true, sameSite: 'Strict', expires: 7 }); // Expire dans 7 jours
      Cookies.set('user', JSON.stringify({
        roles: userData.roles,
        nom: userData.nom,
        prenom: userData.prenom,
        photo: userData.photo,
      }), { secure: true, sameSite: 'Strict', expires: 7 });

      // Mettre à jour l'état avec les informations de l'utilisateur
      setUser (userData);
      navigate('/'); // Rediriger vers le tableau de bord après connexion
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
    }
  };

  /**
   * Fonction pour s'inscrire.
   * @param {Object} userData - Les données de l'utilisateur.
   */
  const signup = async (userData) => {
    await login(userData); // Se connecter directement après l'inscription
  };

  /**
   * Fonction pour se déconnecter.
   */
  const logout = () => {
    Cookies.remove('token'); // Supprimer le cookie du token
    Cookies.remove('user'); // Supprimer les informations de l'utilisateur
    setUser (null); // Réinitialiser l'état utilisateur
    navigate('/'); // Rediriger vers la page d'accueil
  };

  // Fournir les données et fonctions via le contexte
  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};