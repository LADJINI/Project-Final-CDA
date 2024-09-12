// Importation des dépendances nécessaires
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaSearch, FaBars, FaChevronDown } from 'react-icons/fa';
import AuthModal from '../auth/AuthModal';
import { useCart } from '/src/context/CartContext';
import { useBooks } from '/src/context/BookContext';
import CartPopup from '../common/CartPopup';

const Navbar = () => {
  // Utilisation des hooks personnalisés pour le panier et la recherche de livres
  const { getTotalItems, getTotalPrice, cart } = useCart();
  const { searchBooks } = useBooks();
  const navigate = useNavigate();

  // États pour gérer l'ouverture/fermeture des différents éléments de l'interface
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartPopupOpen, setIsCartPopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCatalogueOpen, setIsCatalogueOpen] = useState(false);
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);

  // Référence pour le bouton du panier (utilisée pour positionner le popup)
  const cartButtonRef = useRef(null);
  const [cartButtonPosition, setCartButtonPosition] = useState({ top: 0, left: 0 });

  // Calcul du nombre total d'articles et du prix total du panier
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  // Gestion de l'ouverture de la modal d'authentification
  const handleAuthClick = () => {
    setIsAuthModalOpen(true);
    setIsMenuOpen(false);
  };

  // Gestion de l'ouverture/fermeture du popup du panier
  const handleCartClick = (e) => {
    e.preventDefault();
    const rect = cartButtonRef.current.getBoundingClientRect();
    setCartButtonPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setIsCartPopupOpen(!isCartPopupOpen);
    setIsMenuOpen(false);
  };

  // Gestion de la recherche
  const handleSearch = (e) => {
    e.preventDefault();
    searchBooks(searchTerm);
    navigate('/search-results');
    setIsMenuOpen(false);
  };

  // Effet pour fermer le menu mobile lors d'un clic en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.menu-button')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo et nom du site complètement à gauche */}
            <div className="flex items-center justify-start">
              <Link to="/" className="flex items-center mr-auto">
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

            {/* Barre de recherche centrée */}
            <form onSubmit={handleSearch} className="relative w-full max-w-md mx-auto hidden md:flex">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher..."
                className="w-full px-3 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 mt-2 mr-3 text-gray-400 hover:text-blue-500 focus:outline-none"
                aria-label="Rechercher"
              >
                <FaSearch className="h-4 w-4" />
              </button>
            </form>

            {/* Liens de navigation principaux et boutons à droite */}
            <div className="flex items-center space-x-4 ml-auto">
              <Link to="/" className="hidden md:flex text-gray-600 hover:text-blue-600">Accueil</Link>

              {/* Menu déroulant Catalogue */}
              <div className="hidden md:flex relative" onMouseEnter={() => setIsCatalogueOpen(true)} onMouseLeave={() => setIsCatalogueOpen(false)}>
                <button className="flex items-center text-gray-600 hover:text-blue-600">
                  Catalogue <FaChevronDown className="ml-1" />
                </button>
                {isCatalogueOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    <Link to="/emprunter-livre" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Emprunter un livre</Link>
                    <Link to="/acheter-livre" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Acheter un livre</Link>
                  </div>
                )}
              </div>

              {/* Menu déroulant Ajouter un livre */}
              <div className="hidden md:flex relative" onMouseEnter={() => setIsAddBookOpen(true)} onMouseLeave={() => setIsAddBookOpen(false)}>
                <button className="flex items-center text-gray-600 hover:text-blue-600">
                  Ajouter un livre <FaChevronDown className="ml-1" />
                </button>
                {isAddBookOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    <Link to="/ajouter-livre-vente" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Ajouter un livre à vendre</Link>
                    <Link to="/ajouter-livre-pret" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Ajouter un livre à prêter</Link>
                  </div>
                )}
              </div>

              {/* Boutons d'authentification et panier */}
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

              {/* Menu hamburger pour mobile */}
              <div className="md:hidden flex items-center">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 menu-button">
                  <FaBars size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden mobile-menu">
            {/* Contenu du menu mobile */}
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
