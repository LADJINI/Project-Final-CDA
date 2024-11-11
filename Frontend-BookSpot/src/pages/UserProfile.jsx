import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BookContext';

/**
 * Composant de profil utilisateur.
 * Affiche les informations de l'utilisateur, ses livres à vendre et ses livres à donner.
 * 
 * @returns {JSX.Element} Le rendu du profil utilisateur.
 */
const UserProfile = () => {
  const { user } = useAuth();  // Récupérer l'utilisateur du contexte
  const { booksToSell, booksToGive } = useBooks();  // Récupérer les livres du contexte
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('account');  // Section active dans le menu déroulant

  const navigate = useNavigate();

  /**
   * Effet de récupération des données de l'utilisateur.
   */
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        navigate('/loginForm');  // Redirige l'utilisateur vers la page de connexion s'il n'est pas connecté
        return;
      }

      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const userDataResponse = await axios.get(`http://localhost:8086/api/users/email/${user.email}`, config);
        setUserData(userDataResponse.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des données utilisateur :", err);
        if (err.response && err.response.status === 404) {
          setError('Utilisateur non trouvé.');
        } else {
          setError('Erreur lors de la récupération des données utilisateur.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, user]);

  /**
   * Sélectionne les livres de l'utilisateur à partir des données du contexte
   */
  const userBooksForSale = booksToSell.filter(book => book.user_id === user?.id);
  const userBooksForDonation = booksToGive.filter(book => book.user_id === user?.id);

  /**
   * Handlers pour changer la section active du profil utilisateur
   */
  const handleEditProfile = () => {
    setActiveSection('account');
  };

  const handleEditBooksForSale = () => {
    setActiveSection('booksForSale');
  };

  const handleEditBooksForDonation = () => {
    setActiveSection('booksForDonation');
  };

  // Si l'utilisateur est en cours de chargement ou s'il y a une erreur, afficher un message
  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!userData) return <p>Aucune donnée disponible</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 border rounded-md shadow-lg bg-white">
      <h1 className="text-2xl font-bold mb-4">Profil de l'utilisateur</h1>

      {/* Menu déroulant pour naviguer entre les différentes sections */}
      <div className="flex space-x-4 mb-6">
        <button onClick={handleEditProfile} className="text-blue-500 hover:underline">Votre compte</button>
        <button onClick={handleEditBooksForSale} className="text-blue-500 hover:underline">Vos livres à vendre</button>
        <button onClick={handleEditBooksForDonation} className="text-blue-500 hover:underline">Vos livres à donner</button>
      </div>

      {/* Section du profil utilisateur */}
      {activeSection === 'account' && (
        <div className="mb-4">
          {userData ? (
            <div className="flex flex-col">
              <p><strong>Nom:</strong> {userData.nom}</p>
              <p><strong>Prénom:</strong> {userData.prenom}</p>
              <p><strong>Email:</strong> {userData.email}</p>
            </div>
          ) : (
            <p>Chargement du profil...</p>
          )}
        </div>
      )}

      {/* Section des livres à vendre */}
      {activeSection === 'booksForSale' && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Vos livres à vendre</h2>
          {userBooksForSale.length === 0 ? (
            <p>Aucun livre à vendre</p>
          ) : (
            <ul>
              {userBooksForSale.map((book) => (
                <li key={book.id}>
                  <p>{book.title} - {book.price}€</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Section des livres à donner */}
      {activeSection === 'booksForDonation' && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Vos livres à donner</h2>
          {userBooksForDonation.length === 0 ? (
            <p>Aucun livre à donner</p>
          ) : (
            <ul>
              {userBooksForDonation.map((book) => (
                <li key={book.id}>
                 <p>{book.title} - {book.price}€</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
