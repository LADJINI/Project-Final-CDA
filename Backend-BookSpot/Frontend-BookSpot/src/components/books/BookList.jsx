import React from 'react';
import { useCart } from "../../context/useCart";

const BookList = ({ books, type }) => {
  const { addToCart } = useCart();

  const handleAction = (book) => {
    addToCart({ ...book, type });
  };

  if (books.length === 0) {
    return <p>Aucun livre disponible pour le moment.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {books.map(book => (
        <div key={book.id} className="border rounded-lg p-4 shadow-md">
          <h3 className="text-xl font-semibold mb-2">{book.titre}</h3>
          <p className="text-gray-600 mb-1">Auteur: {book.auteur}</p>
          <p className="text-gray-600 mb-1">ISBN: {book.isbn}</p>
          <p className="text-gray-600 mb-1">État: {book.etatLivre}</p>
          <p className="text-gray-600 mb-1">Pages: {book.nombrePages}</p>
          <p className="text-gray-600 mb-1">Éditeur: {book.editeur}</p>
          <p className="text-gray-600 mb-1">Date de publication: {book.datePublication}</p>
          <p className="text-gray-600 mb-2">Quantité disponible: {book.quantiteDisponible}</p>
          <p className="text-lg font-bold mb-3">Prix: {book.prixUnitaire}€</p>
          <button 
            onClick={() => handleAction(book)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            {type === 'achat' ? 'Acheter' : 'Emprunter'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default BookList;