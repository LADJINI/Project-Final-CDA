import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BookContext';
import { FiEdit2 } from 'react-icons/fi';
import BooksForSale from './BooksForSale';
import BooksForDonation from './BooksForDonation';

/**
 * Composant pour afficher et gérer le profil utilisateur.
 * @component
 */
const UserProfile = () => {
  const { user, logout } = useAuth(); // Contexte d'authentification pour obtenir l'utilisateur connecté
  const { booksToSell, booksToGive } = useBooks(); // Contexte des livres à vendre et à donner
  const [userData, setUserData] = useState(null); // Données utilisateur récupérées
  const [editMode, setEditMode] = useState({}); // Mode d'édition pour les champs
  const [updatedFields, setUpdatedFields] = useState({}); // Champs mis à jour
  const [loading, setLoading] = useState(true); // État de chargement
  const [error, setError] = useState(null); // Gestion des erreurs
  const [activeSection, setActiveSection] = useState('account'); // Section active
  const [deleteConfirmation, setDeleteConfirmation] = useState(false); // Affichage du dialogue de confirmation
  const [password, setPassword] = useState(''); // Mot de passe saisi par l'utilisateur
  const navigate = useNavigate();

  // Récupération des données utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        navigate('/loginForm');
        return;
      }
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const response = await axios.get(`http://localhost:8086/api/users/email/${user.email}`, config);
        setUserData(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des données utilisateur :", err);
        setError('Erreur lors de la récupération des données utilisateur.');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate, user]);

  /**
   * Permet de gérer l'édition d'un champ donné.
   * @param {string} field - Le nom du champ à éditer.
   */
  const handleEditClick = (field) => {
    setEditMode((prevState) => ({ ...prevState, [field]: true }));
  };

  /**
   * Met à jour la valeur d'un champ lors de la saisie.
   * @param {string} field - Le nom du champ à mettre à jour.
   * @param {string} value - La nouvelle valeur du champ.
   */
  const handleInputChange = (field, value) => {
    setUpdatedFields((prevState) => ({ ...prevState, [field]: value }));
  };

  /**
   * Sauvegarde les modifications pour un champ donné.
   * @param {string} field - Le nom du champ à sauvegarder.
   */
  const handleSaveClick = async (field) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const updatedUserData = { ...userData, [field]: updatedFields[field] };
      const response = await axios.put(
        `http://localhost:8086/api/users/email/${user.email}`,
        updatedUserData,
        config
      );
      setUserData(response.data);
      setEditMode((prevState) => ({ ...prevState, [field]: false }));
      setUpdatedFields((prevState) => {
        const newState = { ...prevState };
        delete newState[field];
        return newState;
      });
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
      setError("Erreur lors de la mise à jour.");
    }
  };

  /**
   * Gère la suppression du compte utilisateur.
   */
  const handleDeleteAccount = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
        data: { password }, // Envoi du mot de passe pour confirmation
      };
      await axios.delete(`http://localhost:8086/api/users/${user.id}`, config);
      alert('Votre compte a été supprimé avec succès.');
      logout(); // Déconnexion de l'utilisateur
      navigate('/'); // Redirection vers l'accueil
    } catch (err) {
      console.error("Erreur lors de la suppression du compte :", err);
      setError("Échec de la suppression du compte. Vérifiez votre mot de passe.");
    }
  };

  // Rendu conditionnel en fonction de l'état
  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!userData) return <p>Aucune donnée disponible</p>;

  const fields = [
    { name: 'nom', label: 'Nom', type: 'text' },
    { name: 'prenom', label: 'Prénom', type: 'text' },
    { name: 'sexe', label: 'Sexe', type: 'text' },
    { name: 'dateNaissance', label: 'Date de naissance', type: 'date' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'password', label: 'Mot de passe', type: 'password' },
    { name: 'address', label: 'Adresse', type: 'text' },
    { name: 'telephone', label: 'Téléphone', type: 'tel' },
  ];

  return (
    <div className="max-w-3xl mx-auto p-6 border rounded-md shadow-lg bg-white">
      <h1 className="text-2xl font-bold mb-4">Bonjour {userData.nom} {userData.prenom} !</h1>

      <div className="flex space-x-4 mb-6">
        <button onClick={() => setActiveSection('account')} className="text-blue-500 hover:underline">Votre compte</button>
        <button onClick={() => setActiveSection('booksForSale')} className="text-blue-500 hover:underline">Vos livres à vendre</button>
        <button onClick={() => setActiveSection('booksForDonation')} className="text-blue-500 hover:underline">Vos livres à donner</button>
      </div>

      {activeSection === 'account' && (
        <form className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="flex items-center">
              <label className="w-1/3 font-semibold">{field.label} :</label>
              {editMode[field.name] ? (
                <input
                  type={field.type}
                  defaultValue={field.type === 'password' ? '' : userData[field.name]}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="border rounded px-2 py-1 flex-grow"
                  placeholder={field.type === 'password' ? '********' : ''}
                />
              ) : (
                <span className="flex-grow">
                  {field.type === 'password' ? '********' : userData[field.name]}
                </span>
              )}
              <button
                type="button"
                className="ml-2 text-blue-500"
                onClick={() => (editMode[field.name] ? handleSaveClick(field.name) : handleEditClick(field.name))}
              >
                {editMode[field.name] ? 'Enregistrer' : <FiEdit2 />}
              </button>
            </div>
          ))}
          <button
            type="button"
            className="text-red-500 mt-6"
            onClick={() => setDeleteConfirmation(true)}
          >
            Supprimer mon compte
          </button>
        </form>
      )}

      {deleteConfirmation && (
        <div className="mt-4 p-4 border rounded-md bg-gray-50">
          <p className="text-red-500 mb-4">Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.</p>
          <input
            type="password"
            placeholder="Confirmez votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded px-2 py-1 mb-4 w-full"
          />
          <div className="flex space-x-4">
            <button
              className="text-white bg-red-500 px-4 py-2 rounded-md"
              onClick={handleDeleteAccount}
            >
              Confirmer
            </button>
            <button
              className="text-blue-500 hover:underline"
              onClick={() => setDeleteConfirmation(false)}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {activeSection === 'booksForSale' && <BooksForSale user={user} />}
      {activeSection === 'booksForDonation' && <BooksForDonation user={user} />}
    </div>
  );
};

export default UserProfile;
