import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaSearch, FaBars } from 'react-icons/fa';
import AuthModal from '../auth/AuthModal';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleAuthClick = () => {
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo et nom du site, cliquables pour rediriger vers la page d'accueil */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img
                  src="/Log2.PNG"
                  alt="Logo"
                  className="h-12 w-auto mr-3"
                />
                <div className="flex flex-col items-start">
                  <span
                    className="text-xl sm:text-2xl font-bold text-blue-600"
                    style={{ fontFamily: 'Tilda Script Bold' }}
                  >
                    Book Spot
                  </span>
                  <p className="font-serif text-xs sm:text-sm text-gray-600">
                    Bibliothèque accessible à tous
                  </p>
                </div>
              </Link>
            </div>

            {/* Barre de recherche */}
            <div className="hidden md:flex items-center flex-grow max-w-xl mx-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Rechercher par Titre, Auteur, ISBN..."
                  className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="absolute right-0 top-0 mt-2 mr-4">
                  <FaSearch className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Liens de navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <button onClick={handleAuthClick} className="flex items-center text-gray-600 hover:text-blue-600">
                <FaUser className="mr-2" />
                <span>Identifiez-vous</span>
              </button>
              <Link to="/panier" className="flex items-center text-gray-600 hover:text-blue-600">
                <FaShoppingCart className="mr-2" />
                <span>Panier</span>
              </Link>
            </div>

            {/* Menu hamburger pour mobile */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600">
                <FaBars size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
              <button 
                onClick={handleAuthClick} 
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600"
              >
                Identifiez-vous
              </button>
              <Link 
                to="/panier" 
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600"
              >
                Mon Panier
              </Link>
            </div>
          </div>
        )}
      </nav>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
};

export default Navbar;