import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BookContext';
import { FiEdit2 } from 'react-icons/fi';
import BooksForSale from './BooksForSale';
import BooksForDonation from './BooksForDonation';

const UserProfile = () => {
  const { user } = useAuth();
  const { booksToSell, booksToGive } = useBooks();
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState({});
  const [updatedFields, setUpdatedFields] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('account');
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

  const handleEditClick = (field) => {
    setEditMode((prevState) => ({ ...prevState, [field]: true }));
  };

  const handleInputChange = (field, value) => {
    setUpdatedFields((prevState) => ({ ...prevState, [field]: value }));
  };

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
    { name: 'telephone', label: 'Téléphone', type: 'tel' }
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
        </form>
      )}

      {activeSection === 'booksForSale' && (
        <div className="mb-4">
          
          {booksToSell.filter(book => book.user_id === user?.id).length === 0 ? (
            <p></p>
          ) : (
            <ul>
              {booksToSell.filter(book => book.user_id === user?.id).map((book) => (
                <li key={book.id}>
                  <p>{book.title} - {book.price}€</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {activeSection === 'booksForDonation' && (
        <div className="mb-4">
          
          {booksToGive.filter(book => book.user_id === user?.id).length === 0 ? (
            <p></p>
          ) : (
            <ul>
              {booksToGive.filter(book => book.user_id === user?.id).map((book) => (
                <li key={book.id}>
                  <p>{book.title} - {book.price}€</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
           {activeSection === 'booksForSale' && <BooksForSale user={user} />}

{activeSection === 'booksForDonation' && <BooksForDonation user={user} />}
    </div>
  );
};

export default UserProfile;