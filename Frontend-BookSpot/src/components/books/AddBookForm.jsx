import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useBooks } from '../../context/BookContext';

/**
 * Composant de formulaire pour ajouter un livre.
 * @param {Object} props - Les propriétés du composant.
 * @param {string} props.type - Le type d'ajout ('vente' ou 'prêt').
 * @returns {JSX.Element} Formulaire pour ajouter un livre.
 */
const AddBookForm = ({ type }) => {
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
    setIsSubmitting(true);

    // Validation des champs requis
    if (!bookData.title || !bookData.author || !selectedImage) {
      setError('Veuillez remplir tous les champs requis et sélectionner une image.');
      setIsSubmitting(false);
      return;
    }

    const bookWithType = {
      ...bookData,
      type: type === 'vente' ? 'vente' : 'emprunt',
      price: parseFloat(bookData.price) || 0,
    };

    if (selectedImage) {
      const formData = new FormData();
      formData.append('book', new Blob([JSON.stringify(bookWithType)], { type: 'application/json' }));
      formData.append('image', selectedImage);

      try {
        const response = await axios.post('http://localhost:8086/api/books', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.status === 201) {
          const addedBook = response.data;
          if (type === 'vente') {
            addBookToSell(addedBook);
          } else if (type === 'prêt') {
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
        setError('Erreur lors de l\'ajout du livre.');
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
    <div>
      <h1>Ajouter un Livre</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Titre:</label>
          <input type="text" name="title" value={bookData.title} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="author">Auteur :</label>
          <input type="text" name="author" value={bookData.author} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="availability">Disponibilité:</label>
          <input type="checkbox" name="availability" checked={bookData.availability} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="bookCondition">Condition:</label>
          <select name="bookCondition" value={bookData.bookCondition} onChange={handleChange}>
            <option value="neuf">Neuf</option>
            <option value="occasion">Occasion</option>
          </select>
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea name="description" value={bookData.description} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="isbn">ISBN:</label>
          <input type="text" name="isbn" value={bookData.isbn} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="numberOfPages">Nombre de pages:</label>
          <input type="number" name="numberOfPages" value={bookData.numberOfPages} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="price">Prix:</label>
          <input type="number" name="price" value={bookData.price} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="publicationDate">Date de publication:</label>
          <input type="date" name="publicationDate" value={bookData.publicationDate} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="publisher">Éditeur:</label>
          <input type="text" name="publisher" value={bookData.publisher} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="quantityAvailable">Quantité disponible:</label>
          <input type="number" name="quantityAvailable" value={bookData.quantityAvailable} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="image">Image:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} required />
          {imagePreview && <img src={imagePreview} alt="Aperçu" width="100" />}
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Ajout en cours...' : 'Ajouter le livre'}
        </button>
      </form>
    </div>
  );
};

AddBookForm.propTypes = {
  type: PropTypes.oneOf(['vente', 'prêt']).isRequired,
};

export default AddBookForm;