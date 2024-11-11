import React from 'react';
import AddBookForm from '../../components/books/AddBookForm';

/**
 * Composant pour ajouter un livre à donner.
 * 
 * @returns {JSX.Element} Page avec formulaire d'ajout de livre à prêter.
 */
const AjouterLivreDon = () => {
  return (
    <div>
      <h1>Ajouter un Livre à Donner</h1>
      <AddBookForm type="don" />
    </div>
  );
};

export default AjouterLivreDon;
