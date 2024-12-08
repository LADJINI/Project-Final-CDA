import React, { useEffect, useState } from 'react';
import BookList from "../../components/books/BookList";
import { useCart } from '../../context/useCart';
import axios from 'axios';

const AcheterLivre = () => {
  const { addToCart } = useCart();
  const [booksToSell, setBooksToSell] = useState([]);

  // Fonction pour récupérer les livres à vendre depuis l'API
  const fetchBooksToSell = async () => {
    try {
      const response = await axios.get('http://localhost:8086/api/books/type/1'); // API pour les livres à vendre
      setBooksToSell(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des livres à vendre:', error);
    }
  };

  // Récupération des livres lors du premier rendu
  useEffect(() => {
    fetchBooksToSell();
  }, []);

  const handleAchat = (livre) => {
    addToCart({ ...livre, type: 'achat' });
  };

  // Vérification si booksToSell est un tableau
  if (!Array.isArray(booksToSell)) {
    return <div>Erreur : Impossible de charger les livres à vendre.</div>;
  }

  return (
    <div>
      <h1>Acheter un Livre</h1>
      <BookList books={booksToSell} type="achat" onBookAction={handleAchat} />
    </div>
  );
};

export default AcheterLivre;
