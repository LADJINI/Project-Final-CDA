// Dans SearchResultsPage.jsx
import React from 'react';
import { useBooks } from '@/context/BookContext';
import { useCart } from '@/context/useCart';

const SearchResultsPage = () => {
  const { searchResults } = useBooks();
  const { addToCart } = useCart();

  const handleAddToCart = (book) => {
    console.log("Ajout au panier:", book); // Pour le débogage
    addToCart(book);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Résultats de la recherche</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {searchResults.map((book) => (
          <div key={book.id} className="border rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-semibold mb-2">{book.titre}</h2>
            <p className="mb-1"><span className="font-medium">Auteur:</span> {book.auteur}</p>
            <p className="mb-1"><span className="font-medium">ISBN:</span> {book.isbn}</p>
            <p className="mb-3"><span className="font-medium">Type:</span> {book.type === 'sell' ? 'À vendre' : 'À emprunter'}</p>
            {book.type === 'sell' && <p className="mb-3"><span className="font-medium">Prix:</span> {book.prixUnitaire}€</p>}
            <button 
              onClick={() => handleAddToCart(book)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Ajouter au panier ({book.type === 'sell' ? 'Acheter' : 'Emprunter'})
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResultsPage;