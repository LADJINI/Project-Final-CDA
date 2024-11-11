import React, { createContext, useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';


const BookContext = createContext();

/**
 * Fournisseur de contexte pour gérer les livres à vendre et à prêter.
 * @param {Object} props - Les propriétés du fournisseur.
 * @param {ReactNode} props.children - Les éléments enfants à rendre à l'intérieur du fournisseur.
 * @returns {JSX.Element} Le rendu du fournisseur de contexte.
 */
export const BookProvider = ({ children }) => {
  const [booksToSell, setBooksToSell] = useState([]);
  const [booksToGive, setBooksToGive] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false); // Indique si une recherche a été effectuée

  
  // Fonction pour charger les livres depuis la base de données
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const responseSell = await axios.get('http://localhost:8086/api/books?type=vente');
        const responseGive = await axios.get('http://localhost:8086/api/books?type=don');
        setBooksToSell(responseSell.data);
        setBooksToGive(responseGive.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des livres:', error);
      }
    };

    fetchBooks();
  }, []);

  /**
   * Ajoute un livre à la liste des livres à vendre.
   * @param {Object} book - Le livre à ajouter.
   */
  const addBookToSell = (book) => {
    setBooksToSell(prevBooks => [...prevBooks, { ...book, type: 'vente' }]);
  };

  /**
   * Ajoute un livre à la liste des livres à donner.
   * @param {Object} book - Le livre à ajouter.
   */
  const addBookToGive = (book) => {
    setBooksToGive(prevBooks => [...prevBooks, { ...book, type: 'don' }]);
  };

  /**
   * Recherche des livres dans les listes de vente et de don.
   * @param {string} term - Le terme de recherche.
   */
  const searchBooks = (term) => {
    const allBooks = [...booksToSell, ...booksToGive];
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
      booksToGive, 
      addBookToSell, 
      addBookToGive, 
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
