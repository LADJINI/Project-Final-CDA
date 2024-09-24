import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import { useBooks } from "../../context/BookContext";
import axios from 'axios';

/**
 * Composant AddBookForm pour ajouter un livre à la liste.
 * @param {Object} props - Les propriétés du composant.
 * @param {string} props.type - Type d'action ('vente' ou 'prêt').
 * @returns {JSX.Element} Le rendu du composant AddBookForm.
 */
const AddBookForm = ({ type }) => {
  const { addBookToSell, addBookToLend } = useBooks();

  const initialState = {
    id: '',
    title: '',
    author: '',
    availability: true,
    bookCondition: 'neuf',
    description: '',
    isbn: '',
    numberOfPages: '',
    price: '',
    publicationDate: '',
    published: true,
    publisher: '',
    quantityAvailable: ''
  };

  const [bookData, setBookData] = useState(initialState);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Utiliser le hook pour la navigation


  /**
   * Gère les changements des champs du formulaire.
   * @param {Object} e - L'événement de changement.
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  /**
   * Gère la soumission du formulaire pour ajouter un livre.
   * @param {Object} e - L'événement de soumission.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const bookWithTypeAndId = {
      ...bookData,
      id: Date.now().toString(), // Génération d'un ID unique
      type: type === 'vente' ? 'achat' : 'emprunt',
      price: parseFloat(bookData.price) // Conversion du prix
    };

    try {
      // Envoi de la requête POST au backend
      const response = await axios.post('http://localhost:8086/api/books', bookWithTypeAndId);
      if (response.status === 201) {
        // Ajout du livre à la liste appropriée
        if (type === 'vente') {
          addBookToSell(bookWithTypeAndId);
        } else if (type === 'prêt') {
          addBookToLend(bookWithTypeAndId);
        }
        
        // Réinitialisation du formulaire
        setBookData(initialState);
        setError('');
        console.log(`Livre ajouté pour ${type}:`, bookWithTypeAndId);

         // Redirection vers la page d'accueil après une soumission réussie
      navigate('/');  // Redirige vers la page d'accueil
      }
    } catch (e) {
      setError('Erreur lors de l\'ajout du livre.');
      console.error(e); // Pour le débogage
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 gap-4">
        {/* Champ pour le titre du livre */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Titre</label>
          <input
            type="text"
            name="title"
            id="title"
            value={bookData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Champ pour l'auteur du livre */}
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700">Auteur</label>
          <input
            type="text"
            name="author"
            id="author"
            value={bookData.author}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Champ pour l'ISBN */}
        <div>
          <label htmlFor="isbn" className="block text-sm font-medium text-gray-700">ISBN</label>
          <input
            type="text"
            name="isbn"
            id="isbn"
            value={bookData.isbn}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Champ pour le prix */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Prix</label>
          <input
            type="number"
            name="price"
            id="price"
            value={bookData.price}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Champ pour l'état du livre */}
        <div>
          <label htmlFor="bookCondition" className="block text-sm font-medium text-gray-700">État</label>
          <select
            name="bookCondition"
            id="bookCondition"
            value={bookData.bookCondition}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="neuf">Neuf</option>
            <option value="très bon état">Très bon état</option>
            <option value="bon état">Bon état</option>
            <option value="état moyen">État moyen</option>
            <option value="mauvais état">Mauvais état</option>
          </select>
        </div>

        {/* Champ pour le nombre de pages */}
        <div>
          <label htmlFor="numberOfPages" className="block text-sm font-medium text-gray-700">Nombre de pages</label>
          <input
            type="number"
            name="numberOfPages"
            id="numberOfPages"
            value={bookData.numberOfPages}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Champ pour le nombre de livres disponibles */}
        <div>
          <label htmlFor="quantityAvailable" className="block text-sm font-medium text-gray-700">Quantité disponible</label>
          <input
            type="number"
            name="quantityAvailable"
            id="quantityAvailable"
            value={bookData.quantityAvailable}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Champ pour le nom de l'éditeur */}
        <div>
          <label htmlFor="publisher" className="block text-sm font-medium text-gray-700">Éditeur</label>
          <input
            type="text"
            name="publisher"
            id="publisher"
            value={bookData.publisher}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Champ pour la date de publication */}
        <div>
          <label htmlFor="publicationDate" className="block text-sm font-medium text-gray-700">Date de publication</label>
          <input
            type="date"
            name="publicationDate"
            id="publicationDate"
            value={bookData.publicationDate}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Champ pour la description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            id="description"
            value={bookData.description}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          ></textarea>
        </div>
      </div>

      {error && <p className="text-red-600">{error}</p>}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
      >
        Ajouter le livre
      </button>
    </form>
  );
};

// Définition des types de propriétés pour le composant AddBookForm
AddBookForm.propTypes = {
  type: PropTypes.oneOf(['vente', 'prêt']).isRequired,
};

export default AddBookForm;
