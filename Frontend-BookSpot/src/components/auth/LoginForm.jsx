import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const LoginForm = ({ onClose }) => {
  const { login } = useAuth(); // Récupération de la fonction login depuis le contexte d'authentification
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  // Gestion des changements dans les champs du formulaire
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Validation et soumission des données de connexion
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      // Simuler les données de connexion (vous pouvez remplacer par un appel à une API)
      const userData = {
        token: 'dummy_token',  // Token fictif pour l'exemple
        roles: ['user'],  // Rôle par défaut
        nom: 'Dupont',  // Nom fictif (remplacer par le vrai)
        prenom: 'Jean',  // Prénom fictif (remplacer par le vrai)
        photo: 'default.jpg'  // Image par défaut
      };

      await login(userData); // Connecter l'utilisateur via le contexte
      onClose();  // Fermer le modal après connexion réussie
    } catch (error) {
      setError("Erreur lors de la connexion. Veuillez vérifier vos informations.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="text-red-500 mb-4">{error}</p>} {/* Affichage des erreurs */}
      <div className="mb-4">
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Mot de passe</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Se connecter
      </button>
    </form>
  );
};

export default LoginForm;
