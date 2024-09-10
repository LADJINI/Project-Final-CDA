// EmprunterLivre.jsx
import React from 'react';
import BookList from "../../components/books/BookList";
import { useCart } from '../../context/useCart';
import { useBooks } from '../../context/BookContext';

const EmprunterLivre = () => {
  const { addToCart } = useCart();
  const { booksToLend } = useBooks();

  const handleEmprunt = (livre) => {
    addToCart({ ...livre, type: 'emprunt' });
  };

  return (
    <div>
      <h1>Emprunter un Livre</h1>
      <BookList books={booksToLend} type="emprunt" onBookAction={handleEmprunt} />
    </div>
  );
};

export default EmprunterLivre;