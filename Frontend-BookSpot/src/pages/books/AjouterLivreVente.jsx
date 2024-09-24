import React from 'react';
import AddBookForm from '../../components/books/AddBookForm';

/**
 * Composant pour ajouter un livre à vendre.
 * 
 * @returns {JSX.Element} Page avec formulaire d'ajout de livre à vendre.
 */
const AjouterLivreVente = () => {
  return (
    <div>
      <h1>Ajouter un Livre à Vendre</h1>
      <AddBookForm type="vente" />
    </div>
  );
};

export default AjouterLivreVente;
