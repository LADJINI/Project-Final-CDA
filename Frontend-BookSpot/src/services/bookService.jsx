// bookService.js

export const getBooksForSale = async () => {
  try {
    const response = await fetch('http://localhost:8086/api/books/type/1');  // URL pour "à vendre"
    const data = await response.json();
    return data; // Retourner les livres récupérés
  } catch (error) {
    console.error("Erreur lors de la récupération des livres à vendre", error);
    return [];
  }
};

export const getBooksForDonation = async () => {
  try {
    const response = await fetch('http://localhost:8086/api/books/type/3');  // URL pour "à donner"
    const data = await response.json();
    return data; // Retourner les livres récupérés
  } catch (error) {
    console.error("Erreur lors de la récupération des livres à donner", error);
    return [];
  }
};
