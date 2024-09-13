import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const Footer = () => {
  return (
    <footer className="bg-[#155e75] text-white"> {/* Changement ici */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          {/* Logo et description */}
          <div className="mb-1 md:mb-0">
            <Link to="/" className="text-lg font-bold">Book Spot</Link>
            <p className="mt-1 text-xs text-gray-300">Votre bibliothèque en ligne accessible à tous.</p>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-md font-semibold mb-1">Liens rapides</h3>
            <ul className="space-y-0.5">
              <li><Link to="/" className="hover:text-blue-400 text-xs">Accueil</Link></li>
              <li><Link to="/catalogue" className="hover:text-blue-400 text-xs">Catalogue</Link></li>
              <li><Link to="/a-propos" className="hover:text-blue-400 text-xs">À propos</Link></li>
            </ul>
          </div>

          {/* Informations légales */}
          <div>
            <h3 className="text-md font-semibold mb-1">Informations légales</h3>
            <ul className="space-y-0.5">
              <li><Link to="/conditions-utilisation" className="hover:text-blue-400 text-xs">Conditions d'utilisation</Link></li>
              <li><Link to="/politique-confidentialite" className="hover:text-blue-400 text-xs">Politique de confidentialité</Link></li>
              <li><Link to="/mentions-legales" className="hover:text-blue-400 text-xs">Mentions légales</Link></li>
            </ul>
          </div>

          {/* Réseaux sociaux et contact */}
          <div>
            <h3 className="text-md font-semibold mb-1">Suivez-nous</h3>
            <div className="flex space-x-1 mb-1">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                <FaFacebookF size={16} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                <FaTwitter size={16} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                <FaInstagram size={16} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                <FaLinkedinIn size={16} />
              </a>
            </div>
            <div className="flex items-center">
              <MdEmail size={16} className="mr-1" />
              <a href="mailto:contact@bookspot.com" className="hover:text-blue-400 text-xs">contact@bookspot.com</a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-2 pt-1 border-t border-gray-700 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} Book Spot. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;