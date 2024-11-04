import React, { useState } from 'react';
import { useCart } from '/src/context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '/src/context/AuthContext';
import AuthModal from '../auth/AuthModal';

/**
 * Affiche une fenêtre popup pour visualiser le panier.
 * Exige la connexion avant de passer à la validation de la commande.
 * @param {Object} props - Les propriétés du composant.
 * @param {boolean} props.isOpen - État pour afficher ou masquer la popup.
 * @param {function} props.onClose - Fonction de fermeture de la popup.
 * @param {Object} props.position - Position de la popup.
 * @returns {JSX.Element|null} Le composant de la popup du panier.
 */
const CartPopup = ({ isOpen, onClose, position }) => {
  const { cart, removeFromCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

   // État pour afficher ou masquer le modal d'authentification
   const [authModalOpen, setAuthModalOpen] = useState(false);

  if (!isOpen) return null;

  /**
   * Gestionnaire de validation de commande.
   * Si l'utilisateur n'est pas connecté, redirige vers la page de connexion.
   */
  const handleCheckout = () => {
    onClose();
    if (user) {
      navigate('/checkout');
    } else {
      setAuthModalOpen(true); // Ouvre le modal si l'utilisateur n'est pas connecté
    }
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
            <p>Prix unitaire: {item.price}€</p>
            <p>Total: {(item.price * item.quantity).toFixed(2)}€</p>
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
        {/* Affiche le modal d'authentification si authModalOpen est vrai */}
        {authModalOpen && (
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      )}
    </div>
  );
};

export default CartPopup;
