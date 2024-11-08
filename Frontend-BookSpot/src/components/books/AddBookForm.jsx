import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useBooks } from '../../context/BookContext';
import { useAuth } from '../../context/AuthContext'; // Importer le contexte d'authentification

import AuthModal from '../auth/AuthModal';

/**
 * Composant de formulaire pour ajouter un livre.
 * @param {Object} props - Les propriétés du composant.
 * @param {string} props.type - Le type d'ajout ('vente' ou 'prêt').
 * @returns {JSX.Element} Formulaire pour ajouter un livre.
 */
const AddBookForm = ({ type }) => {
  const { user } = useAuth(); // Récupérer l'utilisateur depuis le contexte d'authentification
  const { addBookToSell, addBookToLend } = useBooks();
  
  const initialState = {
    title: '',
    author: '',
    availability: true,
    bookCondition: 'neuf',
    description: '',
    isbn: '',
    numberOfPages: '',
    price: '',
    publicationDate: '',
    publisher: '',
    quantityAvailable: '',
    imageId: '',
  };

  const [bookData, setBookData] = useState(initialState);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

    // État pour afficher ou masquer le modal d'authentification
    const [authModalOpen, setAuthModalOpen] = useState(false);


  /**
   * Gère les changements dans les champs du formulaire.
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - Événement de changement
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  /**
   * Gère la sélection de l'image.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Événement de changement
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  /**
   * Gère la soumission du formulaire.
   * @param {React.FormEvent<HTMLFormElement>} e - Événement de soumission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    setIsSubmitting(true);

    // Validation des champs requis
    if (!bookData.title || !bookData.author || !selectedImage) {
      setError('Veuillez remplir tous les champs requis et sélectionner une image.');
      setIsSubmitting(false);
      return;
    }

    const bookWithType = {
      ...bookData,
      type: type === 'vente' ? 'vente' : 'don',
      price: parseFloat(bookData.price) || 0,
      userId: user.id, // Inclure l'ID de l'utilisateur
    };

    if (selectedImage) {
      const formData = new FormData();
      formData.append('book', new Blob([JSON.stringify(bookWithType)], { type: 'application/json' }));
      formData.append('image', selectedImage);

      try {
        const response = await axios.post('http://localhost:8086/api/books', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${user.token}`, // Ajouter le token d'authentification
          },
        });

        if (response.status === 201) {
          const addedBook = response.data;
          if (type === 'vente') {
            addBookToSell(addedBook);
          } else if (type === 'don') {
            addBookToLend(addedBook);
          }

          // Réinitialisation du formulaire
          setBookData(initialState);
          setSelectedImage(null);
          setImagePreview(null);
          setError('');
          console.log(`Livre ajouté pour ${type}:`, addedBook);
          navigate('/'); // Redirige vers la page d'accueil
        }
      } catch (e) {
        if (e.response && e.response.status === 401) {
          setError('Erreur d\'authentification : vous devez être connecté.');
         
        } else {
          setError('Erreur lors de l\'ajout du livre.');
        }
        console.error(e);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setError('Veuillez sélectionner une image.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Ajouter un Livre</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Titre</label>
            <input type="text" name="title" id="title" value={bookData.title} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
          </div>
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700">Auteur</label>
            <input type="text" name="author" id="author" value={bookData.author} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
          </div>
        </div>

        <div className="flex items-center">
          <input type="checkbox" name="availability" id="availability" checked={bookData.availability} onChange={handleChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
          <label htmlFor="availability" className="ml-2 block text-sm text-gray-900">Disponible</label>
        </div>

        <div>
          <label htmlFor="bookCondition" className="block text-sm font-medium text-gray-700">État</label>
          <select name="bookCondition" id="bookCondition" value={bookData.bookCondition} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option value="neuf">Neuf</option>
            <option value="occasion">Occasion</option>
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" id="description" rows="3" value={bookData.description} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="isbn" className="block text-sm font-medium text-gray-700">ISBN</label>
            <input type="text" name="isbn" id="isbn" value={bookData.isbn} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
          </div>
          <div>
            <label htmlFor="numberOfPages" className="block text-sm font-medium text-gray-700">Nombre de pages</label>
            <input type="number" name="numberOfPages" id="numberOfPages" value={bookData.numberOfPages} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Prix</label>
            <input type="number" name="price" id="price" value={bookData.price} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
          </div>
          <div>
            <label htmlFor="publicationDate" className="block text-sm font-medium text-gray-700">Date de publication</label>
            <input type="date" name="publicationDate" id="publicationDate" value={bookData.publicationDate} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="publisher" className="block text-sm font-medium text-gray-700">Éditeur</label>
            <input type="text" name="publisher" id="publisher" value={bookData.publisher} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
          </div>
          <div>
            <label htmlFor="quantityAvailable" className="block text-sm font-medium text-gray-700">Quantité disponible</label>
            <input type="number" name="quantityAvailable" id="quantityAvailable" value={bookData.quantityAvailable} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
          </div>
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
          <input type="file" id="image" accept="image/*" onChange={handleImageChange} required className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
          {imagePreview && (
            <div className="mt-2">
              <img src={imagePreview} alt="Aperçu" className="w-32 h-32 object-cover rounded-md" />
            </div>
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
          {isSubmitting ? 'Ajout en cours...' : 'Ajouter le livre'}
        </button>
      </form>
      {authModalOpen && <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />}
      </div>
  );
};

AddBookForm.propTypes = {
  type: PropTypes.oneOf(['vente', 'don']).isRequired,
};

export default AddBookForm;
