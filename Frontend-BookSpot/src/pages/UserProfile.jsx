import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AddBookForm from '../components/books/AddBookForm';
import UserProfileForm from '../components/auth/UserProfileForm';

const UserProfile = () => {
  const { user } = useAuth(); // Récupérer l'utilisateur du contexte
  const [userData, setUserData] = useState(null);
  const [userBooks, setUserBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingBook, setIsEditingBook] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        navigate('/loginForm');
        return;
      }
      
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };

        // Récupérer les données de l'utilisateur et ses livres
        const [userDataResponse, userBooksResponse] = await Promise.all([
          axios.get(`http://localhost:8086/api/users/email/${user.email}`, config),
          axios.get('http://localhost:8086/api/books', config),
        ]);

        setUserData(userDataResponse.data);
        setUserBooks(
          userBooksResponse.data.filter((book) => book.userId === userDataResponse.data.id)
        );
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

  const handleUpdateProfile = async (updatedUserData) => {
    if (!user) return;

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const response = await axios.put(
        `http://localhost:8086/api/users/${userData.id}`,
        updatedUserData,
        config
      );
      setUserData(response.data);
      setIsEditingProfile(false);
    } catch (err) {
      console.error("Erreur lors de la mise à jour du profil :", err);
      setError('Erreur lors de la mise à jour du profil.');
    }
  };

  const handleEditBook = (book) => {
    setSelectedBook(book);
    setIsEditingBook(true);
  };

  const handleDeleteBook = async (bookId) => {
    if (!user) return;

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`http://localhost:8086/api/books/${bookId}`, config);
      setUserBooks(userBooks.filter((book) => book.id !== bookId));
    } catch (err) {
      console.error("Erreur lors de la suppression du livre :", err);
      setError('Erreur lors de la suppression du livre.');
    }
  };

  const handleFormSubmit = async (newBookData) => {
    if (!user) return;

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      if (isEditingBook && selectedBook) {
        const response = await axios.put(
          `http://localhost:8086/api/books/${selectedBook.id}`,
          newBookData,
          config
        );
        setUserBooks(userBooks.map((book) => (book.id === selectedBook.id ? response.data : book)));
      } else {
        const response = await axios.post('http://localhost:8086/api/books', newBookData, config);
        setUserBooks([...userBooks, response.data]);
      }
      setSelectedBook(null);
      setIsEditingBook(false);
    } catch (err) {
      console.error("Erreur lors de l'ajout/modification du livre :", err);
      setError("Erreur lors de l'ajout/modification du livre.");
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!userData) return <p>Aucune donnée disponible</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 border rounded-md shadow-lg bg-white">
      <h1 className="text-2xl font-bold mb-4">Profil de l'utilisateur</h1>
      {isEditingProfile ? (
        <UserProfileForm
          initialUserData={userData}
          onSave={handleUpdateProfile}
          onCancel={() => setIsEditingProfile(false)}
        />
      ) : (
        <div className="mb-4">
          <p><strong>Nom :</strong> {userData.nom}</p>
          <p><strong>Prénom :</strong> {userData.prenom}</p>
          <p><strong>Email :</strong> {userData.email}</p>
          <button
            onClick={() => setIsEditingProfile(true)}
            className="text-blue-500 hover:underline mt-4"
          >
            Modifier le profil
          </button>
        </div>
      )}

      <h2 className="text-xl font-semibold mt-6 mb-4">Mes Publications</h2>
      {userBooks.length === 0 ? (
        <p>Aucune publication disponible</p>
      ) : (
        <ul className="space-y-4">
          {userBooks.map((book) => (
            <li key={book.id} className="border p-4 rounded-md shadow-sm flex justify-between items-center">
              <div>
                <p><strong>Titre :</strong> {book.title}</p>
              </div>
              <div>
                <button onClick={() => handleEditBook(book)} className="text-blue-500 hover:underline mr-4">Modifier</button>
                <button onClick={() => handleDeleteBook(book.id)} className="text-red-500 hover:underline">Supprimer</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <h2 className="text-xl font-semibold mt-6 mb-4">
        {isEditingBook ? 'Modifier le Livre' : 'Ajouter un Nouveau Livre'}
      </h2>
      <AddBookForm
        initialBookData={selectedBook}
        onSubmit={handleFormSubmit}
        onCancel={() => { setIsEditingBook(false); setSelectedBook(null); }}
      />
    </div>
  );
};

export default UserProfile;
