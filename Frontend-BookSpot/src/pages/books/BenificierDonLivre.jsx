import React, { useEffect, useState } from 'react';
import BookList from "../../components/books/BookList";
import { useCart } from '../../context/useCart';
import axios from 'axios';

const BenificierDonLivre = () => {
  const { addToCart } = useCart();
  const [booksToGive, setBooksToGive] = useState([]);

  // Fonction pour récupérer les livres à donner depuis l'API
  const fetchBooksToGive = async () => {
    try {
      const response = await axios.get('http://localhost:8086/api/books/type/3'); // API pour les livres à donner
      setBooksToGive(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des livres à donner:', error);
    }
  };

  // Récupération des livres lors du premier rendu
  useEffect(() => {
    fetchBooksToGive();
  }, []);

  const handleGive = (livre) => {
    addToCart({ ...livre, type: 'don' });
  };

  // Vérification si booksToGive est un tableau
  if (!Array.isArray(booksToGive)) {
    return <div>Erreur : Impossible de charger les livres à prêter.</div>;
  }

  return (
    <div>
      <h1>Don de livres</h1>
      <BookList books={booksToGive} type="beneficier_don" onBookAction={handleGive} />
    </div>
  );
};

export default BenificierDonLivre;
