import React from 'react';
import AddBookForm from '../../components/books/AddBookForm';

/**
 * Composant pour ajouter un livre à prêter.
 * 
 * @returns {JSX.Element} Page avec formulaire d'ajout de livre à prêter.
 */
const AjouterLivrePret = () => {
  return (
    <div>
      <h1>Ajouter un Livre à Prêter</h1>
      <AddBookForm type="prêt" />
    </div>
  );
};

export default AjouterLivrePret;
