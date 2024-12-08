import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useBooks } from '../context/BookContext';
import { useAuth } from '../context/AuthContext';
import { FiEdit2 } from 'react-icons/fi';
import { AiFillDelete } from 'react-icons/ai';

const BooksForSale = () => {
  const { booksToSell, setBooksToSell } = useBooks();
  const { user } = useAuth();
  const [selectedBook, setSelectedBook] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`http://localhost:8086/api/books/user/${user.id}/type/1`, { 
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });
        setBooksToSell(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des livres à vendre:', error);
      }
    };

    if (user) {
      fetchBooks();
    }
  }, [user, setBooksToSell]);

  const getImageUrl = (imageId) => `http://localhost:8086/api/books/image/${imageId}`;

  const handleEdit = (book) => {
    setSelectedBook(book);
    setIsEditing(true);
  };

  const handleDelete = (book) => {
    setBookToDelete(book);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8086/api/books/${bookToDelete.id}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      setBooksToSell(booksToSell.filter(book => book.id !== bookToDelete.id));
      setShowDeleteConfirm(false);
      setBookToDelete(null);
    } catch (error) {
      console.error('Erreur lors de la suppression du livre:', error);
      setError('Erreur lors de la suppression du livre.');
    }
  };

  const handleUpdate = async (updatedBookData) => {
    try {
      const response = await axios.put(`http://localhost:8086/api/books/${selectedBook.id}`, updatedBookData, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setBooksToSell(booksToSell.map(book => (book.id === response.data.id ? response.data : book)));
      setIsEditing(false);
      setSelectedBook(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du livre:', error);
      setError('Erreur lors de la mise à jour du livre.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 border rounded-md shadow-lg bg-white">
      <h1 className="text-2xl font-bold mb-4">Livres à vendre</h1>
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {booksToSell.map(book => (
          <li key={book.id} className="flex items-center mb-4 border-b pb-2">
            <img src={getImageUrl(book.imageId)} alt={book.title} className="w-20 h-auto mr-4" />
            <div className="flex-grow">
              <h2 className="text-lg font-semibold">{book.title}</h2>
              <p>Prix: {book.price} €</p>
            </div>
            <button onClick={() => handleEdit(book)} className="text-blue-500">
              <FiEdit2 />
            </button>
            <button onClick={() => handleDelete(book)} className="text-red-500 ml-2">
              <AiFillDelete />
            </button>
          </li>
        ))}
      </ul>
      {isEditing && selectedBook && (
        <BookForm book={selectedBook} onUpdate={handleUpdate} onClose={() => setIsEditing(false)} />
      )}
      {showDeleteConfirm && (
        <DeleteConfirmPopup onConfirm={confirmDelete} onCancel={() => setShowDeleteConfirm(false)} />
      )}
    </div>
  );
};

const BookForm = ({ book, onUpdate, onClose }) => {
  const [formData, setFormData] = useState(book);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('book', new Blob([JSON.stringify(formData)], { type: 'application/json' }));
    if (selectedImage) {
      data.append('image', selectedImage);
    }
    onUpdate(data);
  };

  return (
    <div className="popup">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold">Modifier le livre</h2>
        <label className="block">
          Titre:
          <input type="text" name="title" value={formData.title} onChange={handleChange} required className="border rounded px-2 py-1 w-full" />
        </label>
        <label className="block">
          Auteur:
          <input type="text" name="author" value={formData.author} onChange={handleChange} required className="border rounded px-2 py-1 w-full" />
        </label>
        <label className="block">
          ISBN:
          <input type="text" name="isbn" value={formData.isbn} onChange={handleChange} className="border rounded px-2 py-1 w-full" />
        </label>
        <label className="block">
          Éditeur:
          <input type="text" name="publisher" value={formData.publisher} onChange={handleChange} className="border rounded px-2 py-1 w-full" />
        </label>
        <label className="block">
          Date de publication:
          <input type="date" name="publicationDate" value={formData.publicationDate} onChange={handleChange} className="border rounded px-2 py-1 w-full" />
        </label>
        <label className="block">
          Nombre de pages:
          <input type="number" name="numberOfPages" value={formData.numberOfPages} onChange={handleChange} className="border rounded px-2 py-1 w-full" />
        </label>
        <label className="block">
          État du livre:
          <input type="text" name="bookCondition" value={formData.bookCondition} onChange={handleChange} required className="border rounded px-2 py-1 w-full" />
        </label>
        <label className="block">
          Disponibilité:
          <select name="availability" value={formData.availability} onChange={handleChange} className="border rounded px-2 py-1 w-full">
            <option value={true}>Disponible</option>
            <option value={false}>Non disponible</option>
          </select>
        </label>
        <label className="block">
          Description:
          <textarea name="description" value={formData.description} onChange={handleChange} required className="border rounded px-2 py-1 w-full" />
        </label>
        <label className="block">
          Quantité disponible:
          <input type="number" name="quantityAvailable" value={formData.quantityAvailable} onChange={handleChange} required className="border rounded px-2 py-1 w-full" />
        </label>
        <label className="block">
          Prix unitaire:
          <input type="number" name="price" value={formData.price} onChange={handleChange} required className="border rounded px-2 py-1 w-full" />
        </label>
        <label className="block ">
          Publication:
          <select name="published" value={formData.published} onChange={handleChange} className="border rounded px-2 py-1 w-full">
            <option value={true}>Oui</option>
            <option value={false}>Non</option>
          </select>
        </label>
        <label className="block">
          Image:
          <input type="file" onChange={handleImageChange} className="border rounded px-2 py-1" />
        </label>
        <div className="flex justify-between">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Sauvegarder</button>
          <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Annuler</button>
        </div>
      </form>
    </div>
  );
};

const DeleteConfirmPopup = ({ onConfirm, onCancel }) => {
  return (
    <div className="popup">
      <h2 className="text-xl font-semibold">Confirmation de suppression</h2>
      <p>Êtes-vous sûr de vouloir supprimer ce livre ?</p>
      <div className="flex justify-between">
        <button onClick={onConfirm} className="bg-red-500 text-white px-4 py-2 rounded">Oui</button>
        <button onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">Non</button>
      </div>
    </div>
  );
};

export default BooksForSale;