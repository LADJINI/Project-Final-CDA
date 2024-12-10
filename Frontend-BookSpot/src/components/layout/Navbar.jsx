import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaSearch, FaChevronDown, FaBars, FaTimes } from 'react-icons/fa';
import AuthModal from '../auth/AuthModal';
import { useCart } from '/src/context/CartContext';
import { useBooks } from '/src/context/BookContext';
import { useAuth } from '/src/context/AuthContext'; 
import CartPopup from '../common/CartPopup';

const Navbar = () => {
  const { getTotalItems, getTotalPrice, cart } = useCart();
  const { searchBooks } = useBooks();
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartPopupOpen, setIsCartPopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCatalogueOpen, setIsCatalogueOpen] = useState(false);
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [cartButtonPosition, setCartButtonPosition] = useState({ top: 0, left: 0 });

  const [catalogueTimeout, setCatalogueTimeout] = useState(null);
  const [addBookTimeout, setAddBookTimeout] = useState(null);

  const cartButtonRef = useRef(null);
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const handleSearch = (e) => {
    e.preventDefault();
    searchBooks(searchTerm);
    navigate('/search-results');
    setIsMenuOpen(false);
  };

  const handleAuthClick = () => {
    setIsAuthModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleClickOutside = (event) => {
    if (isMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.menu-button')) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleCatalogueMouseEnter = () => {
    clearTimeout(catalogueTimeout); // Annuler tout délai de fermeture
    setIsCatalogueOpen(true);
  };

  const handleCatalogueMouseLeave = () => {
    const timeout = setTimeout(() => setIsCatalogueOpen(false), 100); // Fermer après 300ms
    setCatalogueTimeout(timeout); // Stocker l'ID du timeout
  };

  const handleAddBookMouseEnter = () => {
    clearTimeout(addBookTimeout); // Annuler tout délai de fermeture
    setIsAddBookOpen(true);
  };

  const handleAddBookMouseLeave = () => {
    const timeout = setTimeout(() => setIsAddBookOpen(false), 100); // Fermer après 300ms
    setAddBookTimeout(timeout); // Stocker l'ID du timeout
  };

  useEffect(() => {
    return () => {
      // Nettoyer les temporisateurs si le composant est démonté
      clearTimeout(catalogueTimeout);
      clearTimeout(addBookTimeout);
    };
  }, [catalogueTimeout, addBookTimeout]);
  return (
    <>
      <nav className="bg-custom-blue border-b border-gray-200 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4 ml-0">
              <NavLink to="/" className="flex items-center">
                <img src="/Logo_book_spot_2.png" alt="Logo" className="h-16 w-auto mr-2" />
              </NavLink>

              {/* Menu "Commander un livre" visible uniquement sur grand écran */}
              <div
                className="relative lg:block hidden"
                onMouseEnter={handleCatalogueMouseEnter}
                onMouseLeave={handleCatalogueMouseLeave}
              >
                <button className="bg-custom-blue hover:bg-[#164e63] font-medium transition py-2 px-4 rounded-md ml-4 h-16 flex items-center text-sm text-white">
                  Commander un livre <FaChevronDown className="ml-1" />
                </button>
                {isCatalogueOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <NavLink to="/don-livre" className="block px-4 py-2 text-[#155e75] hover:bg-gray-100 text-sm">
                      Je veux recevoir un don
                    </NavLink>
                    <NavLink to="/acheter-livre" className="block px-4 py-2 text-[#155e75] hover:bg-gray-100 text-sm">
                      Je veux acheter un livre
                    </NavLink>
                  </div>
                )}
              </div>

              {/* Menu "Ajouter un livre" visible uniquement sur grand écran */}
              <div
                className="relative lg:block hidden"
                onMouseEnter={handleAddBookMouseEnter}
                onMouseLeave={handleAddBookMouseLeave}
              >
                <button className="bg-custom-blue hover:bg-[#164e63] font-medium transition py-2 px-4 rounded-md ml-4 h-16 flex items-center text-sm text-white">
                  Ajouter un livre <FaChevronDown className="ml-1" />
                </button>
                {isAddBookOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <NavLink to="/ajouter-livre-vente" className="block px-4 py-2 text-[#155e75] hover:bg-gray-100 text-sm">
                      Je souhaite vendre
                    </NavLink>
                    <NavLink to="/ajouter-livre-don" className="block px-4 py-2 text-[#155e75] hover:bg-gray-100 text-sm">
                      Je souhaite donner
                    </NavLink>
                  </div>
                )}
              </div>
            </div>

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

            {/* Menu pour grand écran */}
            <div className="hidden lg:flex items-center space-x-4">
              {user ? (
                <>
                  <NavLink to="/profile" className="flex items-center">
                    <span className="text-white"> &nbsp;   Bonjour {user.nom}  !</span>
                  </NavLink>
                  <button onClick={handleLogout} className="text-sm text-white bg-custom-blue hover:bg-[#164e63] font-medium transition py-2 px-4 rounded-md ml-4 h-16">
                    Déconnexion
                  </button>
                </>
              ) : (
                <button onClick={handleAuthClick} className="flex items-center text-sm text-white bg-custom-blue hover:bg-[#164e63] font-medium transition py-2 px-4 rounded-md h-16">
                  <FaUser />
                  <span className="ml-1">Identifiez-vous</span>
                </button>
              )}
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
                <span>Panier ({totalItems}) - {totalPrice.toFixed(2)}€</span>
              </button>
            </div>

            {/* Hamburger button for small screens */}
            <button 
              className="lg:hidden bg-custom-blue text-2xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </nav>

      {/* Menu mobile */}
      <div
        className={`mobile-menu ${
          isMenuOpen ? 'block' : 'hidden'
        } bg-custom-blue lg:hidden absolute right-0 top-16 w-64 z-50 shadow-lg`}
      >
        <div className="py-2">
          {/* Menu "Commander un livre" pour mobile */}
          <div className="relative">
            <button
              onClick={() => setIsCatalogueOpen(!isCatalogueOpen)}
              className="w-full text-left px-4 py-2 bg-custom-blue hover:bg-[#164e63] transition"
            >
              Commander un livre <FaChevronDown className="float-right mt-1" />
            </button>
            {isCatalogueOpen && (
              <div className="bg-[#0e7490] py-1">
                <NavLink
                  to="/don-livre"
                  className="block px-6 py-2 text-white hover:bg-[#164e63] transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Je veux recevoir un don
                </NavLink>
                <NavLink
                  to="/acheter-livre"
                  className="block px-6 py-2 text-white hover:bg-[#164e63] transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Je veux acheter un livre
                </NavLink>
              </div>
            )}
          </div>

          {/* Menu "Ajouter un livre" pour mobile */}
          <div className="relative">
            <button
              onClick={() => setIsAddBookOpen(!isAddBookOpen)}
              className="w-full text-left px-4 py-2 bg-custom-blue hover:bg-[#164e63] transition"
            >
              Ajouter un livre <FaChevronDown className="float-right mt-1" />
            </button>
            {isAddBookOpen && (
              <div className="bg-[#0e7490] py-1">
                <NavLink
                  to="/ajouter-livre-vente"
                  className="block px-6 py-2 text-white hover:bg-[#164e63] transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Je souhaite vendre
                </NavLink>
                <NavLink
                  to="/ajouter-livre-don"
                  className="block px-6 py-2 text-white hover:bg-[#164e63] transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Je souhaite donner
                </NavLink>
              </div>
            )}
          </div>

          {/* Boutons d'authentification et panier pour mobile */}
          {user ? (
            <>
              <NavLink
                to="/profile"
                className="block px-4 py-2 text-white hover:bg-[#164e63] transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile !
              </NavLink>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 bg-custom-blue hover:bg-[#164e63] transition"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <button
              onClick={handleAuthClick}
              className="w-full text-left px-4 py-2 bg-custom-blue hover:bg-[#164e63] transition"
            >
              <FaUser className="inline-block mr-2" />
              Identifiez-vous
            </button>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsCartPopupOpen(!isCartPopupOpen);
              setIsMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2 bg-custom-blue hover:bg-[#164e63] transition"
          >
            <FaShoppingCart className="inline-block mr-2" />
            Panier ({totalItems}) - {totalPrice.toFixed(2)}€
          </button>
        </div>
      </div>

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
