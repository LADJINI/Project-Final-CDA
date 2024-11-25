import React, { useEffect, useState } from 'react';

import { getLatestBooksForSale, getLatestBooksForDonation } from '../services/bookService'; // Importez les services corrects
import BookCarousel from '../components/books/BookCarousel'; // Assurez-vous que ce chemin est correct
import { useNavigate } from 'react-router-dom'; // Importer useNavigate pour la navigation

const HomePage = () => {
  const [booksForSale, setBooksForSale] = useState([]);
  const [booksForDonation, setBooksForDonation] = useState([]);
  const navigate = useNavigate(); // Pour la navigation vers d'autres pages

  useEffect(() => {
    // Récupérer les derniers livres mis en vente
    const fetchLatestBooksForSale = async () => {
      const latestBooks = await getLatestBooksForSale();
      console.log("Livres à vendre:", latestBooks); // Vérifiez la réponse dans la console
      setBooksForSale(latestBooks);
    };
  // Récupérer les derniers livres mis à donner
  const fetchLatestBooksForDonation = async () => {
    const latestBooks = await getLatestBooksForDonation();
    console.log("Livres pour donation:", latestBooks); // Vérifiez la réponse dans la console
    setBooksForDonation(latestBooks);
  };

    fetchLatestBooksForSale();
    fetchLatestBooksForDonation();
  }, []);

  // Fonction pour naviguer vers la page "Acheter un livre"
  const handleNavigateToBuy = () => {
    navigate('/acheter-livre');
  };

  // Fonction pour naviguer vers la page "Bénificier d'un don"
  const handleNavigateToDonation = () => {
    navigate('/don-livre');
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

      {/* Bloc pour don des livres */}
      <div className="section">
        <h2 onClick={handleNavigateToDonation} style={{ cursor: 'pointer', color: 'blue' }}>
        Bénéficier  d'un don de livres
        </h2>
        <BookCarousel books={booksForDonation} />
      </div>
    </div>
  );
};

export default HomePage;
