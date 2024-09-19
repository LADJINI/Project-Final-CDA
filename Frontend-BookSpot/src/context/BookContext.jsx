import React, { createContext, useState, useContext } from 'react';

const BookContext = createContext();

export const BookProvider = ({ children }) => {
  const [booksToSell, setBooksToSell] = useState([]);
  const [booksToLend, setBooksToLend] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false); // Ajoutez cette ligne

  const addBookToSell = (book) => {
    setBooksToSell(prevBooks => [...prevBooks, { ...book, type: 'sell' }]);
  };
  
  const addBookToLend = (book) => {
    setBooksToLend(prevBooks => [...prevBooks, { ...book, type: 'lend' }]);
  };

  const searchBooks = (term) => {
    const allBooks = [...booksToSell, ...booksToLend];
    const results = allBooks.filter(book => 
      book.titre.toLowerCase().includes(term.toLowerCase()) ||
      book.auteur.toLowerCase().includes(term.toLowerCase()) ||
      book.isbn.includes(term)
    );
    setSearchResults(results);
    setHasSearched(true); // Mettez à jour hasSearched après une recherche
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

export const useBooks = () => useContext(BookContext);