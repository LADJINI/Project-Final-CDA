// AcheterLivre.jsx
import React from 'react';
import BookList from "../../components/books/BookList";
import { useCart } from '../../context/useCart';
import { useBooks } from '../../context/BookContext';

const AcheterLivre = () => {
  const { addToCart } = useCart();
  const { booksToSell } = useBooks();

  const handleAchat = (livre) => {
    addToCart({ ...livre, type: 'achat' });
  };

  return (
    <div>
      <h1>Acheter un Livre</h1>
      <BookList books={booksToSell} type="achat" onBookAction={handleAchat} />
    </div>
  );
};

export default AcheterLivre;