import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useCart } from '../../context/useCart';
import BookDetailsModal from '../common/BookDetailsModal';

/**
 * Composant pour afficher une liste de livres.
 * 
 * @param {Object} props - Les propriétés du composant.
 * @param {Array} props.books - Liste des livres.
 * @param {string} props.type - Type d'affichage (achat ou emprunt).
 * @returns {JSX.Element} Composant d'affichage de la liste des livres.
 */
const BookList = ({ books, type }) => {
  const { addToCart } = useCart();
  const [selectedBook, setSelectedBook] = useState(null);

  /**
   * Génère l'URL de l'image du livre à partir de son ID.
   * 
   * @param {string} imageId - L'identifiant de l'image.
   * @returns {string} L'URL de l'image.
   */
  const getImageUrl = (imageId) => `http://localhost:8086/api/imageFile/${imageId}`;

  /**
   * Gestion de l'ajout d'un livre au panier.
   * 
   * @param {Object} book - Livre à ajouter au panier.
   */
  const handleAddToCart = (book) => {
    addToCart({ ...book, type });
  };

  // Vérifie s'il y a des livres à afficher
  if (!books || books.length === 0) {
    return <p className="text-gray-500">Aucun livre disponible pour le moment.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {books.map((book) => (
        <div key={book.id} className="border rounded-lg p-4 shadow-md flex flex-col justify-between">
          <img
            src={getImageUrl(book.imageId)}
            alt={book.title}
            className="w-1/2 h-32 object-cover rounded-md mb-4"
          />
          <h3 className="text-xl font-semibold">{book.title}</h3>
          <p className="text-gray-700"> {book.author}</p>
          <p className="text-gray-700">{book.bookCondition}</p>
          <p className="text-gray-700"> {book.price}€</p>
          <button
            className="text-blue-500 underline mt-2"
            onClick={() => setSelectedBook(book)}
          >
            Détails
          </button>
          <button
            onClick={() => handleAddToCart(book)}
            className="mt-4 bg-blue-500 text-white px-1 py-2 rounded"
          >
            {type === 'achat' ? 'Acheter' : 'Bénificier'}
          </button>
        </div>
      ))}
      {selectedBook && (
        <BookDetailsModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
};

BookList.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      imageId: PropTypes.string,
      price: PropTypes.number,
    })
  ).isRequired,
  type: PropTypes.oneOf(['achat', 'beneficier_don']).isRequired,
};

export default BookList;