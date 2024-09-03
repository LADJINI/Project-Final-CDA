// src/components/pages/Catalog.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Catalog = () => (
  <div>
    <h1>Catalogue des Livres</h1>
    <nav>
      <ul>
        <li><Link to="/catalog/sell">Vente de Livres</Link></li>
        <li><Link to="/catalog/borrow">Prêt de Livres</Link></li>
      </ul>
    </nav>
  </div>
);

export default Catalog;
