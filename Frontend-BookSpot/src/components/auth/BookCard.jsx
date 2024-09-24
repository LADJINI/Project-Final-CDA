import React from 'react';

/**
 * Composant affichant les détails d'un livre sous forme de carte.
 * 
 * @param {Object} book - Un objet représentant le livre avec les propriétés: title, author, description.
 */
const BookCard = ({ book }) => {
    return (
        <div className="border rounded p-4">
            <h3 className="text-xl font-bold">{book.title}</h3>
            <p>{book.author}</p>
            <p>{book.description}</p>
        </div>
    );
};

export default BookCard;
