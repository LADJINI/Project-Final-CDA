import React from 'react';
import BookCard from '../elements/BookCard'; // Assurez-vous que le chemin d'importation est correct

const BorrowBooks = () => {
  const books = [
    { id: 1, title: "Livre 1", author: "Auteur 1", description: "Description du livre 1" },
    { id: 2, title: "Livre 2", author: "Auteur 2", description: "Description du livre 2" },
    // Ajoutez d'autres livres ici si nécessaire
  ];

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Prêt de Livres</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default BorrowBooks;
