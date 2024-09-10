import React, { useState, useEffect } from 'react';
import { Link , useNavigate  } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaSearch, FaBars } from 'react-icons/fa';
import AuthModal from '../auth/AuthModal';
import { useCart } from '/src/context/CartContext';
import { useBooks } from '/src/context/BookContext';
import CartPopup from '../common/CartPopup'; 

// Composant Navbar principal
const Navbar = () => {
  // Utilisation des hooks personnalisés
  const { getTotalItems, getTotalPrice, cart } = useCart();
  const { searchBooks } = useBooks();
  const navigate = useNavigate();

  // États locaux pour le total des articles et le prix total
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
 
  // États locaux pour gérer les différents éléments interactifs
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartPopupOpen, setIsCartPopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');


  
 // Effet pour mettre à jour les informations du panier
useEffect(() => {
  // Fonction pour mettre à jour les informations du panier
  const updateCartInfo = () => {
    setTotalItems(getTotalItems());
    setTotalPrice(getTotalPrice());
  };

  // Mise à jour immédiate
  updateCartInfo();

  // Configuration d'un intervalle pour des mises à jour régulières
  const intervalId = setInterval(updateCartInfo, 1000);

  // Nettoyage de l'intervalle lors du démontage du composant
  return () => clearInterval(intervalId);
}, [getTotalItems, getTotalPrice, cart]); // Dépendances de l'effet

  // Fonction pour gérer l'ouverture de la modal d'authentification
  const handleAuthClick = () => {
    setIsAuthModalOpen(true);
  };

  // Fonction pour gérer l'ouverture/fermeture du popup du panier
  const handleCartClick = (e) => {
    e.preventDefault();
    setIsCartPopupOpen(!isCartPopupOpen);
  };

  // Fonction pour gérer la recherche
  const handleSearch = (e) => {
    e.preventDefault();
    searchBooks(searchTerm);
    navigate('/search-results');
  };

  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo et nom du site */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img src="/Log2.PNG" alt="Logo" className="h-12 w-auto mr-3" />
                <div className="flex flex-col items-start">
                  <span className="text-xl sm:text-2xl font-bold text-blue-600" style={{ fontFamily: 'Tilda Script Bold' }}>
                    Book Spot
                  </span>
                  <p className="font-serif text-xs sm:text-sm text-gray-600">
                    Bibliothèque accessible à tous
                  </p>
                </div>
              </Link>
            </div>

            {/* Barre de recherche (visible sur les écrans moyens et grands) */}
            <form onSubmit={handleSearch} className="relative flex-grow max-w-xl mx-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par Titre, Auteur, ISBN..."
                className="w-full px-4 py-2 pr-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit" 
                className="absolute right-0 top-0 mt-2 mr-3 text-gray-400 hover:text-blue-500 focus:outline-none"
                aria-label="Rechercher"
              >
                <FaSearch className="h-5 w-5" />
              </button>
            </form>

            {/* Liens de navigation (visibles sur les écrans moyens et grands) */}
            <div className="hidden md:flex items-center space-x-4">
              <button onClick={handleAuthClick} className="flex items-center text-gray-600 hover:text-blue-600">
                <FaUser className="mr-2" />
                <span>Identifiez-vous</span>
              </button>
              {/* Bouton du panier avec le total des articles et le prix total */}
              <button onClick={handleCartClick} className="flex items-center text-gray-600 hover:text-blue-600">
                <FaShoppingCart className="mr-2" />
                <span>Panier ({totalItems}) - {totalPrice.toFixed(2)}€</span>
              </button>
            </div>

            {/* Menu hamburger (visible uniquement sur les petits écrans) */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600">
                <FaBars size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobile (visible uniquement lorsque isMenuOpen est true) */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher..."
                className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
              <button 
                onClick={handleAuthClick} 
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600"
              >
                Identifiez-vous
              </button>
              {/* Bouton du panier dans le menu mobile */}
              <button onClick={handleCartClick} className="flex items-center text-gray-600 hover:text-blue-600">
                <FaShoppingCart className="mr-2" />
                <span>Panier ({totalItems}) - {totalPrice.toFixed(2)}€</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Modal d'authentification */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      {/* Popup du panier */}
      <CartPopup 
        isOpen={isCartPopupOpen} 
        onClose={() => setIsCartPopupOpen(false)}
        cart={cart}
      />
    </>
  );
};

export default Navbar;