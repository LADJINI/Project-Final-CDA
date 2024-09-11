import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaSearch, FaBars } from 'react-icons/fa';
import AuthModal from '../auth/AuthModal';
import { useCart } from '/src/context/CartContext';
import { useBooks } from '/src/context/BookContext';
import CartPopup from '../common/CartPopup'; 

const Navbar = () => {
  // Hooks personnalisés pour accéder aux fonctionnalités du panier et de recherche de livres
  const { getTotalItems, getTotalPrice, cart } = useCart();
  const { searchBooks } = useBooks();
  const navigate = useNavigate();

  // États pour gérer l'ouverture/fermeture des différents éléments de l'interface
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartPopupOpen, setIsCartPopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Référence pour le bouton du panier (utilisée pour positionner le popup)
  const cartButtonRef = useRef(null);
  const [cartButtonPosition, setCartButtonPosition] = useState({ top: 0, left: 0 });

  // Calcul du nombre total d'articles et du prix total du panier
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  // Gestion de l'ouverture de la modal d'authentification
  const handleAuthClick = () => {
    setIsAuthModalOpen(true);
    setIsMenuOpen(false); // Ferme le menu mobile si ouvert
  };

  // Gestion de l'ouverture/fermeture du popup du panier
  const handleCartClick = (e) => {
    e.preventDefault();
    // Calcul de la position du popup par rapport au bouton du panier
    const rect = cartButtonRef.current.getBoundingClientRect();
    setCartButtonPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setIsCartPopupOpen(!isCartPopupOpen);
    setIsMenuOpen(false); // Ferme le menu mobile si ouvert
  };

  // Gestion de la recherche
  const handleSearch = (e) => {
    e.preventDefault();
    searchBooks(searchTerm);
    navigate('/search-results');
    setIsMenuOpen(false); // Ferme le menu mobile après la recherche
  };

  // Effet pour fermer le menu mobile lors d'un clic en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Vérifie si le clic est en dehors du menu et du bouton du menu
      if (isMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.menu-button')) {
        setIsMenuOpen(false);
      }
    };

    // Ajoute l'écouteur d'événements lors du montage du composant
    document.addEventListener('mousedown', handleClickOutside);
    
    // Nettoyage : supprime l'écouteur lors du démontage du composant
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo et nom du site */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img src="/Log2.PNG" alt="Logo" className="h-10 w-auto mr-2" />
                <div className="flex flex-col items-start">
                  <span className="text-lg sm:text-xl font-bold text-blue-600" style={{ fontFamily: 'Tilda Script Bold' }}>
                    Book Spot
                  </span>
                  <p className="font-serif text-xs text-gray-600 hidden sm:block">
                    Bibliothèque accessible à tous
                  </p>
                </div>
              </Link>
            </div>

              {/* Barre de recherche (visible sur les écrans moyens et grands) */}
              <form onSubmit={handleSearch} className="hidden md:flex relative w-full max-w-md lg:max-w-lg xl:max-w-xl">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher..."
                className="w-full px-3 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit" 
                className="absolute right-0 top-0 mt-1 mr-2 text-gray-400 hover:text-blue-500 focus:outline-none"
                aria-label="Rechercher"
              >
                <FaSearch className="h-3 w-5" />
              </button>
            </form>

            {/* Liens de navigation (visibles sur les écrans moyens et grands) */}
            <div className="hidden md:flex items-center space-x-4">
              <button onClick={handleAuthClick} className="flex items-center text-sm text-gray-600 hover:text-blue-600">
                <FaUser className="mr-1" />
                <span>Identifiez-vous</span>
              </button>
              <button 
                ref={cartButtonRef}
                onClick={handleCartClick} 
                className="flex items-center text-sm text-gray-600 hover:text-blue-600"
              >
                <FaShoppingCart className="mr-1" />
                <span>Panier ({totalItems}) - {totalPrice.toFixed(2)}€</span>
              </button>
            </div>

            {/* Menu hamburger (visible uniquement sur les petits écrans) */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 menu-button">
                <FaBars size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobile (s'affiche lorsque isMenuOpen est true) */}
        {isMenuOpen && (
          <div className="md:hidden mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <form onSubmit={handleSearch} className="mb-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full px-3 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </form>
              <button 
                onClick={handleAuthClick} 
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600"
              >
                Identifiez-vous
              </button>
              <button onClick={handleCartClick} className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600">
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
        position={cartButtonPosition}
      />
    </>
  );
};

export default Navbar;