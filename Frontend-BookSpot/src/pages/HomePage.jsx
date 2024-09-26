import React, { useEffect, useState } from 'react';
import { getLatestBooksForSale, getLatestBooksForBorrow } from '../services/bookService'; // Importez les services corrects
import BookCarousel from '../components/books/BookCarousel'; // Assurez-vous que ce chemin est correct
import { useNavigate } from 'react-router-dom'; // Importer useNavigate pour la navigation

const HomePage = () => {
  const [booksForSale, setBooksForSale] = useState([]);
  const [booksForBorrow, setBooksForBorrow] = useState([]);
  const navigate = useNavigate(); // Pour la navigation vers d'autres pages

  useEffect(() => {
    // Récupérer les derniers livres mis en vente
    const fetchLatestBooksForSale = async () => {
      const latestBooks = await getLatestBooksForSale();
      setBooksForSale(latestBooks);
    };

    // Récupérer les derniers livres mis à emprunter
    const fetchLatestBooksForBorrow = async () => {
      const latestBooks = await getLatestBooksForBorrow();
      setBooksForBorrow(latestBooks);
    };

    fetchLatestBooksForSale();
    fetchLatestBooksForBorrow();
  }, []);

  // Fonction pour naviguer vers la page "Acheter un livre"
  const handleNavigateToBuy = () => {
    navigate('/acheter-livre');
  };

  // Fonction pour naviguer vers la page "Emprunter un livre"
  const handleNavigateToBorrow = () => {
    navigate('/emprunter-livre');
  };

  return (
    <div className="homepage">
      {/* Bloc pour acheter des livres */}
      <div className="section">
        <h2 onClick={handleNavigateToBuy} style={{ cursor: 'pointer', color: 'blue' }}>
          Choisissez votre livre à acheter
        </h2>
        <BookCarousel books={booksForSale} />
      </div>

      {/* Bloc pour emprunter des livres */}
      <div className="section">
        <h2 onClick={handleNavigateToBorrow} style={{ cursor: 'pointer', color: 'blue' }}>
          Choisissez un livre à emprunter
        </h2>
        <BookCarousel books={booksForBorrow} />
      </div>
    </div>
  );
};

export default HomePage;
