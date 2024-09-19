import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaSearch, FaChevronDown } from 'react-icons/fa';
import AuthModal from '../auth/AuthModal';
import { useCart } from '/src/context/CartContext';
import { useBooks } from '/src/context/BookContext';
import { useAuth } from '/src/context/AuthContext'; // Importer le contexte d'authentification
import CartPopup from '../common/CartPopup';

const Navbar = () => {
  const { getTotalItems, getTotalPrice, cart } = useCart();
  const { searchBooks } = useBooks();
  const { user, login, logout } = useAuth(); // Accéder au contexte d'authentification pour l'utilisateur
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartPopupOpen, setIsCartPopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCatalogueOpen, setIsCatalogueOpen] = useState(false);
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [catalogueTimeout, setCatalogueTimeout] = useState(null);
  const [addBookTimeout, setAddBookTimeout] = useState(null);

  const cartButtonRef = useRef(null);
  const [cartButtonPosition, setCartButtonPosition] = useState({ top: 0, left: 0 });

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  // Gestion de la recherche de livres
  const handleSearch = (e) => {
    e.preventDefault();
    searchBooks(searchTerm);
    navigate('/search-results');
    setIsMenuOpen(false);
  };

  // Ouvrir la modal de connexion/inscription
  const handleAuthClick = () => {
    setIsAuthModalOpen(true);
    setIsMenuOpen(false);
  };

  // Gestion de la déconnexion
  const handleLogout = () => {
    logout(); // Fonction de déconnexion du contexte AuthContext
    navigate('/'); // Redirection vers la page d'accueil après la déconnexion
  };

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

  // Gestion des événements de survol pour les sous-menus
  const handleCatalogueMouseEnter = () => {
    clearTimeout(catalogueTimeout);
    setIsCatalogueOpen(true);
  };

  const handleCatalogueMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsCatalogueOpen(false);
    }, 300);
    setCatalogueTimeout(timeout);
  };

  const handleAddBookMouseEnter = () => {
    clearTimeout(addBookTimeout);
    setIsAddBookOpen(true);
  };

  const handleAddBookMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsAddBookOpen(false);
    }, 300);
    setAddBookTimeout(timeout);
  };

  return (
    <>
      {/* Header avec barre de recherche, identification et panier */}
      <header className="bg-custom-blue border-b border-gray-200 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Barre de recherche */}
            <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un livre, un auteur, un éditeur..."
                className="w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 ease-in-out"
              />
              <button 
                type="submit" 
                className="absolute right-0 top-0 bottom-0 px-3 bg-orange-500 text-white rounded-r-md focus:outline-none"
                aria-label="Rechercher"
              >
                <FaSearch className="h-5 w-5" />
              </button>
            </form>

            {/* Boutons d'authentification et panier */}
            <div className="flex items-center space-x-4 ml-4">
              {user ? (
                <>
                  {/* Bouton pour afficher le profil et déconnexion */}
                  <div className="flex items-center">
                    <img 
                      src={user.profilePicture || '/default-avatar.jpg'} // Image de profil par défaut si indisponible
                      alt="Profil"
                      className="h-8 w-8 rounded-full mr-2"
                    />
                    <span className="text-white">Bonjour, {user.username}</span>

                    <button 
                      onClick={handleLogout}
                      className="text-sm text-white bg-custom-blue hover:bg-[#164e63] font-medium transition py-2 px-4 rounded-md ml-4"
                    >
                      Déconnexion
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={handleAuthClick}
                  className="flex items-center text-sm text-white bg-custom-blue hover:bg-[#164e63] font-medium transition py-2 px-4 rounded-md h-16"
                >
                  <FaUser className="mr-1" />
                  <span>Identifiez-vous</span>
                </button>
              )}

              {/* Icône du panier */}
              <button
                ref={cartButtonRef}
                onClick={(e) => {
                  e.preventDefault();
                  const rect = cartButtonRef.current.getBoundingClientRect();
                  setCartButtonPosition({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX,
                  });
                  setIsCartPopupOpen(!isCartPopupOpen);
                }}
                className="flex items-center text-sm text-white bg-custom-blue hover:bg-[#164e63] font-medium transition py-2 px-4 rounded-md h-16"
              >
                <FaShoppingCart className="mr-1" />
                <span>
                  Panier ({totalItems}) - {totalPrice.toFixed(2)}€
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navbar principale */}
      <nav className="bg-white border-b border-gray-200 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <NavLink to="/" className="flex items-center">
                <img src="/Log2.PNG" alt="Logo" className="h-16 w-auto mr-2" />
                <div className="flex flex-col items-start">
                  <span className="text-lg sm:text-xl font-bold text-blue-600" style={{ fontFamily: 'Tilda Script Bold' }}>
                    Book Spot
                  </span>
                  <p className="font-serif text-xs text-gray-600 hidden sm:block">
                    Bibliothèque accessible à tous
                  </p>
                </div>
              </NavLink>
            </div>

            <div className="flex items-center space-x-4 ml-auto">
              <NavLink to="/" className="text-[#155e75] hover:text-[#164e63] font-medium transition flex items-center h-16 px-4">
                Accueil
              </NavLink>

              {/* Sous-menu Catalogue */}
              <div
                className="relative"
                onMouseEnter={handleCatalogueMouseEnter}
                onMouseLeave={handleCatalogueMouseLeave}
              >
                <button className="bg-white flex items-center text-[#155e75] hover:text-[#164e63] font-medium transition h-16 px-4">
                  Catalogue <FaChevronDown className="ml-1" />
                </button>
                {isCatalogueOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    <NavLink to="/emprunter-livre" className="block px-4 py-2 text-[#155e75] hover:bg-gray-100">
                      Emprunter un livre
                    </NavLink>
                    <NavLink to="/acheter-livre" className="block px-4 py-2 text-[#155e75] hover:bg-gray-100">
                      Acheter un livre
                    </NavLink>
                  </div>
                )}
              </div>

              {/* Sous-menu Ajouter un livre */}
              <div
                className="relative"
                onMouseEnter={handleAddBookMouseEnter}
                onMouseLeave={handleAddBookMouseLeave}
              >
                <button className="bg-white flex items-center text-[#155e75] hover:text-[#164e63] font-medium transition h-16 px-4">
                  Ajouter un livre <FaChevronDown className="ml-1" />
                </button>
                {isAddBookOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    <NavLink to="/ajouter-livre-vente" className="block px-4 py-2 text-[#155e75] hover:bg-gray-100">
                      Pour vendre
                    </NavLink>
                    <NavLink to="/ajouter-livre-pret" className="block px-4 py-2 text-[#155e75] hover:bg-gray-100">
                      Pour prêter
                    </NavLink>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Modal d'authentification */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

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
