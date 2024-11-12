import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Contexte pour gérer l'état des livres
const BookContext = createContext();

export const BookProvider = ({ children }) => {
  const [booksToSell, setBooksToSell] = useState([]);
  const [booksToGive, setBooksToGive] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Fonction pour charger les livres depuis la base de données
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // Récupère les livres à vendre et à donner depuis l'API
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

  // Ajoute un livre à la vente
  const addBookToSell = (book) => {
    setBooksToSell(prevBooks => [...prevBooks, { ...book, type: 'vente' }]);
  };

  // Ajoute un livre à donner
  const addBookToGive = (book) => {
    setBooksToGive(prevBooks => [...prevBooks, { ...book, type: 'don' }]);
  };

  // Recherche des livres
  const searchBooks = (term) => {
    const allBooks = [...booksToSell, ...booksToGive];
    const results = allBooks.filter(book => 
      book.title.toLowerCase().includes(term.toLowerCase()) ||
      book.author.toLowerCase().includes(term.toLowerCase()) ||
      book.isbn.includes(term)
    );
    setSearchResults(results);
    setHasSearched(true);
    console.log("Résultats de la recherche:", results);
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

// Hook personnalisé pour utiliser le contexte des livres
export const useBooks = () => useContext(BookContext);

export default BookContext;
