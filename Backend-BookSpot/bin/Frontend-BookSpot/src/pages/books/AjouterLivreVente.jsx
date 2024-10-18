import React from 'react';
import AddBookForm from '../../components/books/AddBookForm';

const AjouterLivreVente = () => {
  return (
    <div>
      <h1>Ajouter un Livre à Vendre</h1>
      <AddBookForm type="vente" />
    </div>
  );
};

export default AjouterLivreVente;