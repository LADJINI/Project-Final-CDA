import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaSearch, FaChevronDown } from 'react-icons/fa';
import AuthModal from '../auth/AuthModal';
import { useCart } from '/src/context/CartContext';
import { useBooks } from '/src/context/BookContext';
import { useAuth } from '/src/context/AuthContext'; // Importer le contexte d'authentification
import CartPopup from '../common/CartPopup';

/**
 * Navbar - Composant de la barre de navigation
 * @returns {JSX.Element}
 */
const Navbar = () => {
  const { getTotalItems, getTotalPrice, cart } = useCart(); // Gérer le panier
  const { searchBooks } = useBooks(); // Pour la recherche de livres
  const { user, login, logout } = useAuth(); // Gérer l'authentification utilisateur
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false); // Gestion du menu mobile
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); // Ouverture de la modal d'authentification
  const [isCartPopupOpen, setIsCartPopupOpen] = useState(false); // Ouverture de la popup du panier
  const [searchTerm, setSearchTerm] = useState(''); // Champ de recherche
  const [isCatalogueOpen, setIsCatalogueOpen] = useState(false); // Gestion du sous-menu "Catalogue"
  const [isAddBookOpen, setIsAddBookOpen] = useState(false); // Gestion du sous-menu "Ajouter un livre"
  const [catalogueTimeout, setCatalogueTimeout] = useState(null); // Pour contrôler le délai de fermeture du menu
  const [addBookTimeout, setAddBookTimeout] = useState(null); // Contrôle du délai pour "Ajouter un livre"

  const cartButtonRef = useRef(null); // Référence au bouton du panier pour afficher la popup
  const [cartButtonPosition, setCartButtonPosition] = useState({ top: 0, left: 0 }); // Position du popup panier

  const totalItems = getTotalItems(); // Obtenir le nombre total d'articles dans le panier
  const totalPrice = getTotalPrice(); // Obtenir le prix total des articles dans le panier

  // Gestion de la recherche de livres
  const handleSearch = (e) => {
    e.preventDefault(); 
    searchBooks(searchTerm); // Appelle la fonction pour rechercher des livres
    navigate('/search-results'); // Redirection vers la page des résultats
    setIsMenuOpen(false); // Fermer le menu mobile après recherche
  };

  // Ouvrir la modal d'authentification (connexion/inscription)
  const handleAuthClick = () => {
    setIsAuthModalOpen(true); // Ouvre la modal
    setIsMenuOpen(false); // Ferme le menu mobile
  };

  // Gestion de la déconnexion
  const handleLogout = () => {
    logout(); // Appelle la fonction de déconnexion du contexte d'authentification
    navigate('/'); // Redirection vers la page d'accueil après déconnexion
  };

  // Gestion du clic en dehors du menu pour fermer celui-ci
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.menu-button')) {
        setIsMenuOpen(false); // Fermer le menu si on clique en dehors
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Gestion des événements de survol pour les sous-menus (Catalogue, Ajouter un livre)
  const handleCatalogueMouseEnter = () => {
    clearTimeout(catalogueTimeout); // Empêche la fermeture instantanée du sous-menu
    setIsCatalogueOpen(true); // Ouvre le sous-menu "Catalogue"
  };

  const handleCatalogueMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsCatalogueOpen(false); // Ferme le sous-menu après un délai
    }, 300);
    setCatalogueTimeout(timeout);
  };

  const handleAddBookMouseEnter = () => {
    clearTimeout(addBookTimeout); // Empêche la fermeture instantanée du sous-menu
    setIsAddBookOpen(true); // Ouvre le sous-menu "Ajouter un livre"
  };

  const handleAddBookMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsAddBookOpen(false); // Ferme le sous-menu après un délai
    }, 300);
    setAddBookTimeout(timeout);
  };

  // Gestion du changement de langue
  const [language, setLanguage] = useState({ code: 'fr', label: 'FR', flag: '/path/to/french-flag.png' });
  const languages = [
    { code: 'fr', label: 'FR', flag: 'drapeau-francais.png' },
    { code: 'en', label: 'EN', flag: 'drapeau-royaume-uni.png' }
  ];

  /**
   * Gère le changement de langue et l'affichage
   * @param {Object} lang - Langue sélectionnée
   */
  const handleLanguageChange = (lang) => {
    setLanguage(lang); // Met à jour la langue sélectionnée
    setIsLanguageOpen(false); // Ferme le menu déroulant après le changement de langue
  };

  const [isLanguageOpen, setIsLanguageOpen] = useState(false); // État pour gérer l'ouverture du sélecteur de langue

  // Délai avant la fermeture du menu déroulant
  const [languageTimeout, setLanguageTimeout] = useState(null);

  /**
   * Gère l'ouverture du menu de langue
   */
  const handleLanguageMouseEnter = () => {
    clearTimeout(languageTimeout); // Empêche la fermeture instantanée
    setIsLanguageOpen(true); // Ouvre le menu déroulant
  };

  /**
   * Gère la fermeture du menu de langue après un délai
   */
  const handleLanguageMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsLanguageOpen(false); // Ferme le menu déroulant après un délai
    }, 300);
    setLanguageTimeout(timeout);
  };

  return (
    <>
      {/* Header avec barre de recherche, profil, et panier */}
      <header className="bg-custom-blue border-b border-gray-200 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Barre de recherche */}
            <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Mise à jour du champ de recherche
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
                  <NavLink to="/profil" className="flex items-center">
                    <img 
                      src={user.profilePicture || '/default-avatar.jpg'}
                      alt="Profil"
                      className="h-8 w-8 rounded-full mr-2"
                    />
                    <span className="text-white">Bonjour {user.nom} !</span>
                  </NavLink>

                  <button 
                    onClick={handleLogout} // Déconnexion
                    className="text-sm text-white bg-custom-blue hover:bg-[#164e63] font-medium transition py-2 px-4 rounded-md ml-4"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <button
                  onClick={handleAuthClick} // Ouverture de la modal d'authentification
                  className="flex items-center text-sm text-white bg-custom-blue hover:bg-[#164e63] font-medium transition py-2 px-4 rounded-md h-16"
                >
                  <FaUser />
                  <span className="ml-1">Identifiez-vous</span>
                </button>
              )}

              {/* Bouton du panier */}
              <button
                ref={cartButtonRef}
                onClick={(e) => {
                  e.preventDefault();
                  const rect = cartButtonRef.current.getBoundingClientRect(); // Récupère la position du bouton
                  setCartButtonPosition({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX,
                  });
                  setIsCartPopupOpen(!isCartPopupOpen); // Bascule l'état de la popup panier
                }}
                className="flex items-center text-sm text-white bg-custom-blue hover:bg-[#164e63] font-medium transition py-2 px-4 rounded-md h-16"
              >
                <FaShoppingCart className="mr-1" />
                <span>
                  Panier ({totalItems}) - {totalPrice.toFixed(2)}€
                </span>
              </button>

              {/* Sélecteur de langue */}
              <div 
                className="relative"
                onMouseEnter={handleLanguageMouseEnter}
                onMouseLeave={handleLanguageMouseLeave}
              >
                <button 
                  className="flex items-center text-sm text-white bg-custom-blue hover:bg-[#164e63] font-medium transition py-2 px-4 rounded-md h-16"
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)} // Basculer l'état du menu déroulant
                >
                  <img src={language.flag} alt={language.label} className="h-4 w-4 mr-2" />
                  {language.label} <FaChevronDown className="ml-1" />
                </button>
                {/* Liste des langues */}
                {isLanguageOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    {/* Affiche uniquement l'autre langue */}
                    {languages.filter(lang => lang.code !== language.code).map((lang) => (
                      <button 
                        key={lang.code} 
                        onClick={() => handleLanguageChange(lang)} // Changer la langue
                        className="flex items-center block px-3 py-1 text-sm text-[#155e75] hover:bg-gray-100" // Réduction de la taille du texte
                      >
                        <img src={lang.flag} alt={lang.label} className="h-4 w-4 mr-2" />
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <NavLink to="/emprunter-livre" className="block px-4 py-2 text-[#155e75] hover:bg-gray-100 text-sm">
                      Emprunter un livre
                    </NavLink>
                    <NavLink to="/acheter-livre" className="block px-4 py-2 text-[#155e75] hover:bg-gray-100 text-sm">
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
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <NavLink to="/ajouter-livre-vente" className="block px-4 py-2 text-[#155e75] hover:bg-gray-100 text-sm">
                      Pour vendre
                    </NavLink>
                    <NavLink to="/ajouter-livre-pret" className="block px-4 py-2 text-[#155e75] hover:bg-gray-100 text-sm">
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