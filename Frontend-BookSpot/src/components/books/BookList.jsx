import React from 'react';
import PropTypes from 'prop-types'; // Importation de PropTypes pour la validation des props
import { useCart } from "../../context/useCart";

/**
 * Composant BookList pour afficher une liste de livres.
 * @param {Object} props - Les propriétés du composant.
 * @param {Array} props.books - Liste des livres à afficher.
 * @param {string} props.type - Type d'action ('achat' ou 'emprunt').
 * @returns {JSX.Element} Le rendu du composant BookList.
 */
const BookList = ({ books, type }) => {
  const { addToCart } = useCart();

  /**
   * Gère l'action d'ajout d'un livre au panier.
   * @param {Object} book - Le livre à ajouter au panier.
   */
  const handleAction = (book) => {
    console.log("Livre ajouté au panier :", book); // Pour le débogage
    addToCart({ ...book, type });
  };

  /**
   * Génère l'URL de l'image du livre à partir de son ID.
   * @param {string} imageId - L'identifiant de l'image.
   * @returns {string} L'URL de l'image.
   */
  const getImageUrl = (imageId) => {
    return `http://localhost:8086/api/imageFile/${imageId}`; // URL pour récupérer l'image
  };

  // Vérifie s'il y a des livres à afficher
  if (books.length === 0) {
    return <p>Aucun livre disponible pour le moment.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {books.map(book => (
        <div key={book.id} className="border rounded-lg p-4 shadow-md flex">
          {/* Détails du livre */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
            <p className="text-gray-600 mb-1">Auteur: {book.author}</p>
            <p className="text-gray-600 mb-1">ISBN: {book.isbn}</p>
            <p className="text-gray-600 mb-1">État: {book.bookCondition}</p>
            <p className="text-gray-600 mb-1">Pages: {book.numberOfPages}</p>
            <p className="text-gray-600 mb-1">Éditeur: {book.publisher}</p>
            <p className="text-gray-600 mb-1">Date de publication: {book.publicationDate}</p>
            <p className="text-gray-600 mb-2">Quantité disponible: {book.quantityAvailable}</p>
            <p className="text-lg font-bold mb-3">Prix: {book.price}€</p>

            <button 
              onClick={() => handleAction(book)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              {type === 'achat' ? 'Acheter' : 'Emprunter'}
            </button>
          </div>
          {/* Image du livre */}
          {book.imageId ? (
            <img 
              src={getImageUrl(book.imageId)} 
              className="ml-4 w-48 h-72 object-cover rounded-md shadow-sm"
            />
          ) : (
            <p className="text-gray-600 mb-2">Image non disponible</p>
          )}
        </div>
      ))}
    </div>
  );
};

// Définition des PropTypes pour le composant BookList
BookList.propTypes = {
  books: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    isbn: PropTypes.string,
    bookCondition: PropTypes.string,
    numberOfPages: PropTypes.number,
    publisher: PropTypes.string,
    publicationDate: PropTypes.string,
    quantityAvailable: PropTypes.number,
    price: PropTypes.number.isRequired,
    imageId: PropTypes.string,
  })).isRequired,
  type: PropTypes.oneOf(['achat', 'emprunt']).isRequired,
};

export default BookList;
