import React from 'react';
import BookList from "../../components/books/BookList";
import { useCart } from '../../context/useCart';
import { useBooks } from '../../context/BookContext';

const BenificierDonLivre = () => {
  const { addToCart } = useCart();
  const { booksToGive } = useBooks();

  const handleGive = (livre) => {
    addToCart({ ...livre, type: 'don' });
  };

  // Vérification si booksToGive est un tableau
  if (!Array.isArray(booksToGive)) {
    return <div>Erreur : Impossible de charger les livres à prêter.</div>;
  }

  return (
    <div>
      <h1>Don de livres</h1>
      <BookList books={booksToGive} type="beneficier" onBookAction={handleGive} />
    </div>
  );
};

export default BenificierDonLivre;
