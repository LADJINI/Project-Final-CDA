import React, { useRef, useEffect, useState } from 'react';
import { useCart } from '../../context/useCart';
import { useNavigate } from 'react-router-dom';

const CartPopup = ({ isOpen, onClose }) => {
  // Utilisation du hook useCart pour accéder aux fonctionnalités du panier
  const { cart, removeFromCart, getTotalPrice } = useCart();
  
  // Référence pour le popup (utilisée pour la détection de clic en dehors)
  const popupRef = useRef();
  
  // Hook pour la navigation
  const navigate = useNavigate();
  
  // État local pour stocker le prix total
  const [totalPrice, setTotalPrice] = useState(0);

  // Effet pour gérer le clic en dehors du popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Ajouter l'écouteur d'événements seulement si le popup est ouvert
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Nettoyage : retirer l'écouteur d'événements
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Effet pour mettre à jour le prix total lorsque le panier change
  useEffect(() => {
    const newTotalPrice = getTotalPrice();
    setTotalPrice(newTotalPrice);
    console.log("Prix total mis à jour:", newTotalPrice); // Pour le débogage
  }, [cart, getTotalPrice]);

  // Si le popup n'est pas ouvert, ne rien rendre
  if (!isOpen) return null;

  // Filtrer les livres à vendre et à emprunter
  const booksToSell = cart.filter(item => item.type === 'sell');
  const booksToLend = cart.filter(item => item.type === 'lend');

  // Calculer les sous-totaux pour les livres à vendre et à emprunter
  const totalSell = booksToSell.reduce((total, item) => total + item.prixUnitaire * item.quantity, 0);
  const totalLend = booksToLend.reduce((total, item) => total + item.prixEmprunt * item.quantity, 0);

  // Fonction pour gérer le passage à la page de paiement
  const handleCheckout = () => {
    onClose(); // Fermer le popup
    navigate('/checkout'); // Rediriger vers la page de paiement
  };

  return (
    <div ref={popupRef} className="fixed right-0 top-16 w-96 bg-white shadow-lg rounded-lg p-4 z-50 max-h-[80vh] overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Votre panier</h2>
      {cart.length === 0 ? (
        <p>Votre panier est vide</p>
      ) : (
        <>
          {/* Affichage des livres à acheter */}
          {booksToSell.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Livres à acheter :</h3>
              {booksToSell.map((item) => (
                <div key={item.id} className="flex justify-between items-center mb-2">
                  <span className="text-sm">{item.titre} (x{item.quantity})</span>
                  <span className="text-sm font-bold">{(item.prixUnitaire * item.quantity).toFixed(2)}€</span>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-xs">
                    Supprimer
                  </button>
                </div>
              ))}
              <div className="text-right font-semibold">Sous-total : {totalSell.toFixed(2)}€</div>
            </div>
          )}

          {/* Affichage des livres à emprunter */}
          {booksToLend.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Livres à emprunter :</h3>
              {booksToLend.map((item) => (
                <div key={item.id} className="flex justify-between items-center mb-2">
                  <span className="text-sm">{item.titre} (x{item.quantity})</span>
                  <span className="text-sm font-bold">{(item.prixEmprunt * item.quantity).toFixed(2)}€</span>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-xs">
                    Supprimer
                  </button>
                </div>
              ))}
              <div className="text-right font-semibold">Sous-total : {totalLend.toFixed(2)}€</div>
            </div>
          )}

          {/* Affichage du total général */}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>{totalPrice.toFixed(2)}€</span>
            </div>
          </div>

          {/* Bouton pour valider le panier */}
          <button 
            onClick={handleCheckout}
            className="block w-full text-center bg-blue-500 text-white py-2 rounded mt-4"
          >
            Valider le panier
          </button>
        </>
      )}
    </div>
  );
};

export default CartPopup;