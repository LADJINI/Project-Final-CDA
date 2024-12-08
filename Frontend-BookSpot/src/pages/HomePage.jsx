import React, { useEffect, useState } from 'react';
import { getBooksForSale, getBooksForDonation } from '../services/bookService';
import BookCarousel from '../components/books/BookCarousel';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [booksForSale, setBooksForSale] = useState([]);
  const [booksForDonation, setBooksForDonation] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // Récupérer les livres à vendre et à donner depuis les API
        const latestBooksForSale = await getBooksForSale();
        const latestBooksForDonation = await getBooksForDonation();

        console.log("Books for sale:", latestBooksForSale);
        console.log("Books for donation:", latestBooksForDonation);

        // Mettre à jour les états avec les livres récupérés
        setBooksForSale(latestBooksForSale);
        setBooksForDonation(latestBooksForDonation);
      } catch (error) {
        console.error("Erreur lors de la récupération des livres", error);
      }
    };

    fetchBooks();
  }, []);  // L'effet s'exécute une seule fois au montage du composant

  const handleNavigateToBuy = () => {
    navigate('/acheter-livre');  // Naviguer vers la page d'achat de livres
  };

  const handleNavigateToDonation = () => {
    navigate('/don-livre');  // Naviguer vers la page de don de livres
  };

  return (
    <div className="p-6">
      {/* Section pour les livres à vendre */}
      <div className="mb-8">
        <h2 
          onClick={handleNavigateToBuy} 
          className="text-2xl font-semibold text-blue-600 cursor-pointer mb-4"
        >
          Choisissez votre livre à acheter
        </h2>
        <BookCarousel books={booksForSale} />
      </div>

      {/* Section pour les livres à donner */}
      <div className="mb-8">
        <h2 
          onClick={handleNavigateToDonation} 
          className="text-2xl font-semibold text-blue-600 cursor-pointer mb-4"
        >
          Bénéficiez d'un don de livres
        </h2>
        <BookCarousel books={booksForDonation} />
      </div>
    </div>
  );
};

export default HomePage;
