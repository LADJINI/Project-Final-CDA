import React, { useState } from 'react';
import PropTypes from 'prop-types'; // Importation de PropTypes pour la validation des props
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useBooks } from '../../context/BookContext'; // Importation du contexte des livres

/**
 * Composant de formulaire pour ajouter un livre.
 * @param {Object} props - Les propriétés du composant.
 * @param {string} props.type - Le type d'ajout ('vente' ou 'prêt').
 * @returns {JSX.Element} Formulaire pour ajouter un livre.
 */
const AddBookForm = ({ type }) => {
  const { addBookToSell, addBookToLend } = useBooks(); // Récupération des fonctions pour ajouter un livre
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
    imageId: '', // Ajout de l'imageId pour gérer l'upload
  };

  // États locaux pour gérer les données du livre et l'image sélectionnée
  const [bookData, setBookData] = useState(initialState);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate(); // Hook pour la navigation

  /**
   * Gère les changements dans les champs du formulaire.
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - Événement de changement
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value, // Gérer les cases à cocher
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
      setImagePreview(URL.createObjectURL(file)); // Crée un aperçu de l'image sélectionnée
    }
  };

  /**
   * Gère la soumission du formulaire.
   * @param {React.FormEvent<HTMLFormElement>} e - Événement de soumission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Démarre l'état de soumission

    const bookWithType = {
      ...bookData,
      type: type === 'vente' ? 'vente' : 'emprunt',
      price: parseFloat(bookData.price) || 0, // Conversion du prix avec une valeur par défaut
    };

    // Si une image est sélectionnée, on l'ajoute
    if (selectedImage) {
      const formData = new FormData(); // Crée un nouvel objet FormData
      formData.append('book', new Blob([JSON.stringify(bookWithType)], { type: 'application/json' })); // Ajoute le DTO du livre
      formData.append('image', selectedImage); // Ajoute l'image au FormData

      try {
        const response = await axios.post('http://localhost:8086/api/books', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.status === 201) {
          // Ajout du livre à la liste appropriée dans le contexte
          const addedBook = response.data; // Obtenez les données du livre ajouté
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

          // Redirection vers la page d'accueil après une soumission réussie
          navigate('/'); // Redirige vers la page d'accueil
        }
      } catch (e) {
        setError('Erreur lors de l\'ajout du livre.');
        console.error(e); // Pour le débogage
      } finally {
        setIsSubmitting(false); // Arrête l'état de soumission
      }
    } else {
      setError('Veuillez sélectionner une image.'); // Avertit si aucune image n'est sélectionnée
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Ajouter un Livre</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Titre:</label>
          <input type="text" name="title" value={bookData.title} onChange={handleChange} required />
        </div>
        <div>
          <label>Auteur:</label>
          <input type="text" name="author" value={bookData.author} onChange={handleChange} required />
        </div>
        <div>
          <label>Disponibilité:</label>
          <input type="checkbox" name="availability" checked={bookData.availability} onChange={handleChange} />
        </div>
        <div>
          <label>Condition:</label>
          <select name="bookCondition" value={bookData.bookCondition} onChange={handleChange}>
            <option value="neuf">Neuf</option>
            <option value="occasion">Occasion</option>
          </select>
        </div>
        <div>
          <label>Description:</label>
          <textarea name="description" value={bookData.description} onChange={handleChange} />
        </div>
        <div>
          <label>ISBN:</label>
          <input type="text" name="isbn" value={bookData.isbn} onChange={handleChange} />
        </div>
        <div>
          <label>Nombre de pages:</label>
          <input type="number" name="numberOfPages" value={bookData.numberOfPages} onChange={handleChange} />
        </div>
        <div>
          <label>Prix:</label>
          <input type="number" name="price" value={bookData.price} onChange={handleChange} />
        </div>
        <div>
          <label>Date de publication:</label>
          <input type="date" name="publicationDate" value={bookData.publicationDate} onChange={handleChange} />
        </div>
        <div>
          <label>Éditeur:</label>
          <input type="text" name="publisher" value={bookData.publisher} onChange={handleChange} />
        </div>
        <div>
          <label>Quantité disponible:</label>
          <input type="number" name="quantityAvailable" value={bookData.quantityAvailable} onChange={handleChange} />
        </div>
        <div>
          <label>Image:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} required />
          {imagePreview && <img src={imagePreview} alt="Aperçu" width="100" />} {/* Affiche l'aperçu de l'image */}
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Affiche l'erreur s'il y en a une */}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Ajout en cours...' : 'Ajouter le livre'}
        </button>
      </form>
    </div>
  );
};

// Définition des PropTypes
AddBookForm.propTypes = {
  type: PropTypes.oneOf(['vente', 'prêt']).isRequired, // type doit être soit 'vente' soit 'prêt'
};

export default AddBookForm;
