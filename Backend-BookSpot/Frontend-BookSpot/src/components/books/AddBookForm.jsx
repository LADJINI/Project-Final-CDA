import React, { useState } from 'react';
import { useBooks } from "../../context/BookContext";

const AddBookForm = ({ type }) => {
  // Utilisation du hook personnalisé pour accéder aux fonctions d'ajout de livres
  const { addBookToSell, addBookToLend } = useBooks();

  // État initial du formulaire
  const [bookData, setBookData] = useState({
    id: '', // Champ pour l'ID unique du livre
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

  // Gestion des changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookData(prevData => ({
      ...prevData,
      // Gestion spéciale pour les champs de type checkbox
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Création d'un nouvel objet livre avec un ID unique et le type approprié
    const bookWithTypeAndId = {
      ...bookData,
      id: Date.now().toString(), // Génération d'un ID unique
      type: type === 'vente' ? 'achat' : 'emprunt',
      prixUnitaire: parseFloat(bookData.prixUnitaire) // Conversion du prix en nombre
    };

    // Ajout du livre à la liste appropriée selon le type
    if (type === 'vente') {
      addBookToSell(bookWithTypeAndId);
    } else if (type === 'prêt') {
      addBookToLend(bookWithTypeAndId);
    }

    // Réinitialisation du formulaire après soumission
    setBookData({
      id: '',
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

    console.log(`Livre ajouté pour ${type}:`, bookWithTypeAndId);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 gap-4">
        {/* Champ pour le titre du livre */}
        <input 
          name="titre" 
          value={bookData.titre} 
          onChange={handleChange} 
          placeholder="Titre" 
          required 
          className="w-full px-3 py-2 border rounded-md"
        />

        {/* Champ pour l'auteur du livre */}
        <input 
          name="auteur" 
          value={bookData.auteur} 
          onChange={handleChange} 
          placeholder="Auteur" 
          required 
          className="w-full px-3 py-2 border rounded-md"
        />

        {/* Sélection de la disponibilité du livre */}
        <select 
          name="disponibilite" 
          value={bookData.disponibilite} 
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value={true}>Disponible</option>
          <option value={false}>Non disponible</option>
        </select>

        {/* Sélection de l'état du livre */}
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

        {/* Champ pour la description du livre */}
        <textarea 
          name="description" 
          value={bookData.description} 
          onChange={handleChange} 
          placeholder="Description (max 500 caractères)"
          maxLength={500}
          className="w-full px-3 py-2 border rounded-md"
        />

        {/* Champ pour l'ISBN du livre */}
        <input 
          name="isbn" 
          value={bookData.isbn} 
          onChange={handleChange} 
          placeholder="ISBN" 
          className="w-full px-3 py-2 border rounded-md"
        />

        {/* Champ pour le nombre de pages */}
        <input 
          type="number" 
          name="nombrePages" 
          value={bookData.nombrePages} 
          onChange={handleChange} 
          placeholder="Nombre de pages" 
          min="1"
          className="w-full px-3 py-2 border rounded-md"
        />

        {/* Champ pour le prix unitaire (vente ou emprunt) */}
        <input 
          type="number" 
          name="prixUnitaire" 
          value={bookData.prixUnitaire} 
          onChange={handleChange} 
          placeholder={type === 'vente' ? "Prix de vente" : "Prix d'emprunt"} 
          step="0.01" 
          min="0"
          required
          className="w-full px-3 py-2 border rounded-md"
        />

        {/* Champ pour la date de publication */}
        <input 
          type="date" 
          name="datePublication" 
          value={bookData.datePublication} 
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
        />

        {/* Sélection du statut de publication */}
        <select 
          name="publication" 
          value={bookData.publication} 
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value={true}>Publié</option>
          <option value={false}>Non publié</option>
        </select>

        {/* Champ pour l'éditeur */}
        <input 
          name="editeur" 
          value={bookData.editeur} 
          onChange={handleChange} 
          placeholder="Éditeur" 
          className="w-full px-3 py-2 border rounded-md"
        />

        {/* Champ pour la quantité disponible */}
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

      {/* Bouton de soumission du formulaire */}
      <div className="flex justify-center">
        <button 
          type="submit" 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Ajouter le livre pour {type === 'vente' ? 'la vente' : 'le prêt'}
        </button>
      </div>
    </form>
  );
};

export default AddBookForm;