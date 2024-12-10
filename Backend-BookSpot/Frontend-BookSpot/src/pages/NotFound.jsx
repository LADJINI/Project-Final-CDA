import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">404 - Page Non Trouvée</h1>
      <p>Désolé, la page que vous recherchez n'existe pas.</p>
      <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block">
        Retour à l'accueil
      </Link>
    </div>
  );
};

export default NotFound;