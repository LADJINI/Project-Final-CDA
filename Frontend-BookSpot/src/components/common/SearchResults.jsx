// Dans SearchResults.jsx
import React from 'react';
import { useBooks } from '../../context/BookContext';

const SearchResults = () => {
  const { searchResults, hasSearched } = useBooks();

  if (!hasSearched) {
    return null; // Ne rien afficher si aucune recherche n'a été effectuée
  }

  if (searchResults.length === 0) {
    return <p>Aucun résultat trouvé.</p>;
  }

  return (
    <div>
      <h2>Résultats de la recherche</h2>
      {searchResults.map((book) => (
        <div key={book.id} className="border-b py-2">
          <h3 className="text-lg font-semibold">{book.titre}</h3>
          <p>Auteur: {book.author}</p>
          <p>ISBN: {book.isbn}</p>
          <p>Type: {book.type === 'sell' ? 'À vendre' : 'À emprunter'}</p>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;