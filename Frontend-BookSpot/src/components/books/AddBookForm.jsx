import React, { useState } from 'react';
import { useBooks } from "../../context/BookContext";

const AddBookForm = ({ type }) => {
  const { addBookToSell, addBookToLend } = useBooks();

  const [bookData, setBookData] = useState({
    titre: '',
    auteur: '',
    disponibilite: true,
    etatLivre: 'neuf',
    description: '',
    isbn: '',
    nombrePages: '',
    prixUnitaire: '',
    datePublication: '',
    publication: true,
    editeur: '',
    quantiteDisponible: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === 'vente') {
      addBookToSell(bookData);
    } else if (type === 'prêt') {
      addBookToLend(bookData);
    }
    // Réinitialiser le formulaire
    setBookData({
      titre: '',
      auteur: '',
      disponibilite: true,
      etatLivre: 'neuf',
      description: '',
      isbn: '',
      nombrePages: '',
      prixUnitaire: '',
      datePublication: '',
      publication: true,
      editeur: '',
      quantiteDisponible: ''
    });
    console.log(`Livre ajouté pour ${type}:`, bookData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 gap-4">
        <input 
          name="titre" 
          value={bookData.titre} 
          onChange={handleChange} 
          placeholder="Titre" 
          required 
          className="w-full px-3 py-2 border rounded-md"
        />
        <input 
          name="auteur" 
          value={bookData.auteur} 
          onChange={handleChange} 
          placeholder="Auteur" 
          required 
          className="w-full px-3 py-2 border rounded-md"
        />
        <select 
          name="disponibilite" 
          value={bookData.disponibilite} 
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value={true}>Disponible</option>
          <option value={false}>Non disponible</option>
        </select>
        <select 
          name="etatLivre" 
          value={bookData.etatLivre} 
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="neuf">Neuf</option>
          <option value="occasion">Occasion</option>
          <option value="bonEtat">Bon état</option>
        </select>
        <textarea 
          name="description" 
          value={bookData.description} 
          onChange={handleChange} 
          placeholder="Description (max 500 caractères)"
          maxLength={500}
          className="w-full px-3 py-2 border rounded-md"
        />
        <input 
          name="isbn" 
          value={bookData.isbn} 
          onChange={handleChange} 
          placeholder="ISBN" 
          className="w-full px-3 py-2 border rounded-md"
        />
        <input 
          type="number" 
          name="nombrePages" 
          value={bookData.nombrePages} 
          onChange={handleChange} 
          placeholder="Nombre de pages" 
          className="w-full px-3 py-2 border rounded-md"
        />
        <input 
          type="number" 
          name="prixUnitaire" 
          value={bookData.prixUnitaire} 
          onChange={handleChange} 
          placeholder="Prix unitaire" 
          step="0.01" 
          className="w-full px-3 py-2 border rounded-md"
        />
        <input 
          type="date" 
          name="datePublication" 
          value={bookData.datePublication} 
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
        />
        <select 
          name="publication" 
          value={bookData.publication} 
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value={true}>Publié</option>
          <option value={false}>Non publié</option>
        </select>
        <input 
          name="editeur" 
          value={bookData.editeur} 
          onChange={handleChange} 
          placeholder="Éditeur" 
          className="w-full px-3 py-2 border rounded-md"
        />
        <input 
          type="number" 
          name="quantiteDisponible" 
          value={bookData.quantiteDisponible} 
          onChange={handleChange} 
          placeholder="Quantité disponible"
          min="1"
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div className="flex justify-center">
        <button 
          type="submit" 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Ajouter le livre pour {type}
        </button>
      </div>
    </form>
  );
};

export default AddBookForm;