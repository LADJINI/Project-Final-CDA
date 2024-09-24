import React from 'react';
import { useCart } from "../../context/useCart";
import axios from 'axios';

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
    addToCart({ ...book, type });
  };

  if (books.length === 0) {
    return <p>Aucun livre disponible pour le moment.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {books.map(book => (
        <div key={book.id} className="border rounded-lg p-4 shadow-md">
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
      ))}
    </div>
  );
};

export default BookList;
