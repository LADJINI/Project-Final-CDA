import React, { useEffect, useState } from 'react';
import { getLatestBooksForSale, getLatestBooksForBorrow } from '../services/bookService'; // Assure que les deux fonctions sont importées
import BookCarousel from '../components/books/BookCarousel'; // Le composant carrousel

const HomePage = () => {
  const [booksForSale, setBooksForSale] = useState([]);
  const [booksForBorrow, setBooksForBorrow] = useState([]); // Ajout d'un état distinct pour les livres à emprunter

  useEffect(() => {
    // Fonction pour récupérer les derniers livres à vendre
    const fetchLatestBooksForSale = async () => {
      const latestBooksForSale = await getLatestBooksForSale();
      setBooksForSale(latestBooksForSale);
    };

    // Fonction pour récupérer les derniers livres à emprunter
    const fetchLatestBooksForBorrow = async () => {
      const latestBooksForBorrow = await getLatestBooksForBorrow();
      setBooksForBorrow(latestBooksForBorrow);
    };

    // Appel des deux fonctions dans useEffect
    fetchLatestBooksForSale();
    fetchLatestBooksForBorrow();
  }, []); // Ce useEffect s'exécute une seule fois au montage du composant

  return (
    <div className="homepage">
      {/* Carrousel des livres à vendre */}
      <div className="books-for-sale">
        <h2 onClick={() => window.location.href = '/acheter-livre'}>
          Choisissez votre livre à acheter
        </h2>
        <BookCarousel books={booksForSale} /> {/* Utilise seulement les livres à vendre */}
      </div>

      {/* Carrousel des livres à emprunter */}
      <div className="books-for-borrow">
        <h2 onClick={() => window.location.href = '/emprunter-livre'}>
          Choisissez un livre à emprunter
        </h2>
        <BookCarousel books={booksForBorrow} /> {/* Utilise seulement les livres à emprunter */}
      </div>
    </div>
  );
};

export default HomePage;
