// CartPopup.jsx
import React from 'react';
import { useCart } from '/src/context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartPopup = ({ isOpen, onClose, position }) => {
  const { cart, removeFromCart, getTotalPrice } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <div 
      className="absolute bg-white p-4 rounded-lg shadow-lg z-50"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        maxWidth: '300px',
        width: '100%'
      }}
    >
      <h2 className="text-xl font-bold mb-4">Votre panier</h2>
      {cart.map((item) => (
        <div key={item.id} className="flex justify-between items-center mb-2">
        <div>
          <p className="font-semibold">{item.titre}</p>
          <p>Quantité: {item.quantity}</p>
          <p>Prix unitaire: {item.prixUnitaire}€</p>
          <p>Total: {(item.prixUnitaire * item.quantity).toFixed(2)}€</p>
        </div>
          <button onClick={() => removeFromCart(item.id)} className="text-red-500">
            Supprimer
          </button>
        </div>
      ))}
      <div className="mt-4 border-t pt-2">
        <p className="font-bold">Total: {getTotalPrice().toFixed(2)}€</p>
      </div>
      <div className="mt-4 flex justify-between">
        <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
          Fermer
        </button>
        <button onClick={handleCheckout} className="bg-blue-500 text-white px-4 py-2 rounded">
          Passer la commande
        </button>
      </div>
    </div>
  );
};

export default CartPopup;