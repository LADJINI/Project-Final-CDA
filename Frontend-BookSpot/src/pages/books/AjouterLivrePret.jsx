import React from 'react';
import AddBookForm from '../../components/books/AddBookForm';

const AjouterLivrePret = () => {
  return (
    <div>
      <h1>Ajouter un Livre à Prêter</h1>
      <AddBookForm type="prêt" />
    </div>
  );
};

export default AjouterLivrePret;