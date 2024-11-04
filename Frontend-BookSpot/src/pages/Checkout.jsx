import React, { useState } from 'react';
import { useCart } from '../context/useCart';
import { useNavigate } from 'react-router-dom';

/**
 * Composant Checkout pour gérer le processus de paiement avec Stripe.
 * Utilise le panier d'achat pour calculer le montant total à payer.
 */
const Checkout = () => {
  const { cart, getTotalPrice } = useCart(); // Récupère le panier et le prix total
  const navigate = useNavigate();

  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  /**
   * Gère les changements dans les champs de formulaire pour capturer les informations de carte.
   * @param {Object} e - L'événement de changement d'entrée (input event).
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardInfo(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Envoie une requête au backend pour créer une session de paiement Stripe.
   * Redirige l'utilisateur vers la page de paiement Stripe pour finaliser le paiement.
   * @param {Object} e - L'événement de soumission de formulaire.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation de base des champs de carte
    if (!isValidCardNumber(cardInfo.cardNumber) || !isValidExpiryDate(cardInfo.expiryDate) || !isValidCVV(cardInfo.cvv)) {
      alert("Veuillez vérifier les informations de votre carte.");
      return;
    }

    // Calcul du montant en centimes car Stripe traite les montants en centimes
    const amountInCents = Math.round(getTotalPrice() * 100);

    try {
      // Envoi de la requête au backend pour créer une session de paiement
      const response = await fetch('http://localhost:8086/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: amountInCents }), // Montant total en centimes
      });

      const session = await response.json();

      if (session.url) {
        // Redirige vers l'URL de la session Stripe pour le paiement
        window.location.href = session.url;
      } else {
        console.error("Erreur lors de la création de la session de paiement", session);
        alert("Erreur lors de la création de la session de paiement, veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du paiement : ", error);
      alert("Erreur lors de la soumission du paiement, veuillez réessayer.");
    }
  };

  // Fonctions de validation
  const isValidCardNumber = (number) => /^[0-9]{16}$/.test(number); // Validation pour un numéro de carte de 16 chiffres
  const isValidExpiryDate = (date) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(date); // MM/AA
  const isValidCVV = (cvv) => /^[0-9]{3,4}$/.test(cvv); // 3 ou 4 chiffres

  /**
   * Calcule le prix total d'un article dans le panier en fonction de sa quantité.
   * @param {Object} item - L'article du panier (incluant prix et quantité).
   * @returns {string} - Le prix total de l'article avec deux décimales.
   */
  const calculateItemTotal = (item) => {
    const price = parseFloat(item.price);
    return (price * item.quantity).toFixed(2);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Paiement</h1>

      {/* Section de résumé de la commande */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Résumé de la commande</h2>
        {cart.map(item => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>{item.title} (x{item.quantity})</span>
            <span>{calculateItemTotal(item)}€</span>
          </div>
        ))}
        <div className="font-bold mt-4 text-lg">
          Total à payer : {getTotalPrice().toFixed(2)}€{/* Affiche le prix total du panier */}
        </div>
      </div>

      {/* Formulaire de saisie des informations de paiement */}
      <form onSubmit={handleSubmit} className="max-w-md">
        {/* Champ pour le numéro de carte */}
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
            pattern="[0-9]{16}" // Valide que le numéro de carte a 16 chiffres
            title="Veuillez entrer un numéro de carte valide (16 chiffres)"
          />
        </div>

        {/* Champ pour le nom du titulaire de la carte */}
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

        {/* Champs pour la date d'expiration et le CVV */}
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
              pattern="(0[1-9]|1[0-2])\/\d{2}" // Valide que la date d'expiration est au format MM/AA
              title="Veuillez entrer une date d'expiration valide (MM/AA)"
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
              pattern="[0-9]{3,4}" // Valide que le CVV a 3 ou 4 chiffres
              title="Veuillez entrer un CVV valide (3 ou 4 chiffres)"
            />
          </div>
        </div>

        {/* Bouton pour soumettre le paiement */}
        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Payer {getTotalPrice().toFixed(2)}€{/* Affiche le montant total à payer */}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
