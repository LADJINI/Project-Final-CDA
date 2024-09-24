import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

const BookContext = createContext();

/**
 * Fournisseur de contexte pour gérer les livres à vendre et à prêter.
 * @param {Object} props - Les propriétés du fournisseur.
 * @param {ReactNode} props.children - Les éléments enfants à rendre à l'intérieur du fournisseur.
 * @returns {JSX.Element} Le rendu du fournisseur de contexte.
 */
export const BookProvider = ({ children }) => {
  const [booksToSell, setBooksToSell] = useState([]);
  const [booksToLend, setBooksToLend] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false); // Indique si une recherche a été effectuée

  /**
   * Ajoute un livre à la liste des livres à vendre.
   * @param {Object} book - Le livre à ajouter.
   */
  const addBookToSell = (book) => {
    setBooksToSell(prevBooks => [...prevBooks, { ...book, type: 'sell' }]);
  };

  /**
   * Ajoute un livre à la liste des livres à prêter.
   * @param {Object} book - Le livre à ajouter.
   */
  const addBookToLend = (book) => {
    setBooksToLend(prevBooks => [...prevBooks, { ...book, type: 'lend' }]);
  };

  /**
   * Recherche des livres dans les listes de vente et de prêt.
   * @param {string} term - Le terme de recherche.
   */
  const searchBooks = (term) => {
    const allBooks = [...booksToSell, ...booksToLend];
    const results = allBooks.filter(book => 
      book.title.toLowerCase().includes(term.toLowerCase()) ||
      book.author.toLowerCase().includes(term.toLowerCase()) ||
      book.isbn.includes(term)
    );
    setSearchResults(results);
    setHasSearched(true); // Met à jour hasSearched après une recherche
    console.log("Résultats de la recherche:", results); // Pour le débogage
  };

  return (
    <BookContext.Provider value={{ 
      booksToSell, 
      booksToLend, 
      addBookToSell, 
      addBookToLend, 
      searchBooks,
      searchResults,
      hasSearched
    }}>
      {children}
    </BookContext.Provider>
  );
};

/**
 * Hook personnalisé pour utiliser le contexte des livres.
 * @returns {Object} Les valeurs du contexte des livres.
 */
export const useBooks = () => useContext(BookContext);

// Définition des types de propriétés pour le BookProvider
BookProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default BookContext;
