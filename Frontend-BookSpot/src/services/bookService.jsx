import axios from 'axios';

// Récupère les 6 derniers livres à vendre
export const getLatestBooksForSale = async () => {
  try {
    const response = await axios.get('http://localhost:8086/api/books?type=vente');
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des derniers livres pour la vente:", error);
    return [];
  }
};

// Récupère les 6 derniers livres à donner
export const getLatestBooksForDonation = async () => {
  try {
    const response = await axios.get('http://localhost:8086/api/books?type=don'); 
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des derniers livres pour don:", error);
    return [];
  }
};
