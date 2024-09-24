import React, { useState } from 'react';
import { useCart } from '../context/useCart';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cart, getTotalPrice } = useCart();
  const navigate = useNavigate();

  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici, vous implémenteriez la logique de paiement
    console.log('Paiement effectué', cardInfo);
    navigate('/confirmation');
  };

  // Fonction pour calculer le prix total d'un article
  const calculateItemTotal = (item) => {
    const price = parseFloat(item.price); // Utilisation de 'price' au lieu de 'prixUnitaire'
    return (price * item.quantity).toFixed(2);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Paiement</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Résumé de la commande</h2>
        {cart.map(item => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>{item.title} (x{item.quantity})</span>
            <span>{calculateItemTotal(item)}€</span>
          </div>
        ))}
        <div className="font-bold mt-4 text-lg">
          Total à payer : {getTotalPrice().toFixed(2)}€{/* Utilisation de getTotalPrice */}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="cardNumber" className="block mb-2">Numéro de carte</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={cardInfo.cardNumber}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="cardHolder" className="block mb-2">Nom du titulaire</label>
          <input
            type="text"
            id="cardHolder"
            name="cardHolder"
            value={cardInfo.cardHolder}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="flex mb-4">
          <div className="w-1/2 mr-2">
            <label htmlFor="expiryDate" className="block mb-2">Date d'expiration</label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              value={cardInfo.expiryDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              placeholder="MM/AA"
              required
            />
          </div>
          <div className="w-1/2 ml-2">
            <label htmlFor="cvv" className="block mb-2">CVV</label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={cardInfo.cvv}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Payer {getTotalPrice().toFixed(2)}€{/* Utilisation de getTotalPrice */}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
