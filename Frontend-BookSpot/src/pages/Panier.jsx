import React from 'react';
import { useCart } from '../context/useCart';

const Panier = () => {
  const { cart, getTotalPrice } = useCart();

  return (
    <div>
      <h1 className="text-2xl font-bold">Panier</h1>
      {cart.map(item => (
        <div key={item.id}>
          <p>{item.title} - Quantité: {item.quantity} - Prix: {parseFloat(item.prixUnitaire)* item.quantity}€</p>
        </div>
      ))}
      <p>Total: {getTotalPrice()}€</p>
    </div>
  );
};

export default Panier;