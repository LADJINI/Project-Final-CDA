import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';


const RegisterForm = ({ onClose }) => {
  const { signup } = useAuth(); // Récupération de la fonction signup depuis le contexte d'authentification
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  // Gestion des changements dans les champs du formulaire
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Validation basique du formulaire et soumission des données
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nom, prenom, email, password, confirmPassword } = formData;

    // Validation simple pour vérifier que les mots de passe correspondent
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      // Simuler les données d'inscription (vous pouvez remplacer par un appel à une API)
      const userData = {
        token: 'dummy_token',  // Token fictif pour l'exemple
        roles: ['user'],  // Rôle par défaut
        nom,
        prenom,
        photo: 'default.jpg'  // Image par défaut (remplacer avec le vrai lien)
      };

      await signup(userData); // Inscrire l'utilisateur via le contexte
      onClose();  // Fermer le modal après inscription réussie
    } catch (error) {
      setError("Erreur lors de l'inscription. Veuillez réessayer.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="text-red-500 mb-4">{error}</p>} {/* Affichage des erreurs */}
      <div className="mb-4">
        <label className="block text-gray-700">Nom</label>
        <input
          type="text"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Prénom</label>
        <input
          type="text"
          name="prenom"
          value={formData.prenom}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
          required
        />
      </div>
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
      <div className="mb-4">
        <label className="block text-gray-700">Confirmer le mot de passe</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        S'inscrire
      </button>
    </form>
  );
};

export default RegisterForm;
