import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 py-6 text-white">
      <div className="container mx-auto text-center">
        <p>&copy; 2024 Book Spot. Tous droits réservés.</p>
        <div className="mt-4">
          <a href="https://facebook.com" className="text-blue-400 mx-2">facebook</a>
          <a href="https://twitter.com" className="text-blue-400 mx-2">X</a>
          <a href="https://instagram.com" className="text-blue-400 mx-2">Instagram</a>
        </div>
        <div className="mt-4">
          <a href="/privacy-policy" className="text-blue-400 mx-2">Politique de confidentialité</a>
          <a href="/terms-of-service" className="text-blue-400 mx-2">Conditions d'utilisation</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
