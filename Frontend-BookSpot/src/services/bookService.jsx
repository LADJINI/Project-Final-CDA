import axios from 'axios';

// Récupère les 6 derniers livres à vendre
export const getLatestBooksForSale = async () => {
  try {
    const response = await axios.get('http://localhost:8086/api/books?type=vente&limit=6');
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des derniers livres pour la vente:", error);
    return [];
  }
};

// Récupère les 6 derniers livres à emprunter
export const getLatestBooksForBorrow = async () => {
  try {
    const response = await axios.get('http://localhost:8086/api/books?type=emprunt&limit=6'); // Remplacer "prêt" par "emprunt"
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des derniers livres pour emprunt:", error);
    return [];
  }
};
