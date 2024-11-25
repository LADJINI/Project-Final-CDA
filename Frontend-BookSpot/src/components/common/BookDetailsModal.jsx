import React from 'react';
import PropTypes from 'prop-types';

/**
 * Composant pour afficher les détails d'un livre dans une modale avec l'image du livre.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {Object} props.book - Détails du livre.
 * @param {Function} props.onClose - Fonction pour fermer la modale.
 * @returns {JSX.Element} Composant de la modale des détails du livre.
 */
const BookDetailsModal = ({ book, onClose }) => {
  if (!book) return null;

  const getImageUrl = (imageId) => `http://localhost:8086/api/books/image/${imageId}`;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl relative flex items-center">
        <button
          onClick={onClose}
          className="text-red-500 absolute top-2 right-2 font-bold text-lg"
        >
          X
        </button>
        
        <div className="flex flex-1">
          {/* Section de détails du livre */}
          <div className="w-2/3 p-4">
            <h2 className="text-2xl font-semibold mb-4">{book.title}</h2>
            <p><strong>Auteur:</strong> {book.author}</p>
            <p><strong>Prix:</strong> {book.price}€</p>
            <p><strong>Description:</strong> {book.description}</p>
            <p><strong>Date de publication:</strong> {book.publicationDate}</p>
            <p><strong>ISBN:</strong> {book.isbn}</p>
            <p><strong>Éditeur:</strong> {book.publisher}</p>
            <p><strong>Nombre de pages:</strong> {book.pageCount}</p>
            <p><strong>État du livre:</strong> {book.bookCondition}</p>
          </div>

          {/* Section d'image du livre */}
          <div className="w-1/3 p-4 flex justify-center items-center">
            <img
              src={getImageUrl(book.imageId)}
              alt={`Couverture de ${book.title}`}
              className="w-full h-auto max-h-80 object-cover rounded-md shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

BookDetailsModal.propTypes = {
  book: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    imageId: PropTypes.string.isRequired,
    publicationDate: PropTypes.string.isRequired,
    isbn: PropTypes.string.isRequired,
    publisher: PropTypes.string.isRequired,
    pageCount: PropTypes.number.isRequired,
    bookCondition: PropTypes.string.isRequired, // Ajout de la validation pour bookCondition
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default BookDetailsModal;
