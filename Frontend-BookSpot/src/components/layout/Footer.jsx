import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const Footer = () => {
  return (
    <footer className="bg-[#155e75] text-white">
      <div className="footer-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="footer-logo mb-4 md:mb-0">
          <Link to="/" className="text-lg font-bold">Book Spot</Link>
          <p className="footer-description mt-1">Votre bibliothèque en ligne accessible à tous.</p>
        </div>

        <div className="footer-links">
          <h3 className="footer-title">Liens rapides</h3>
          <ul>
            <li><Link to="/" className="hover:text-blue-400">Accueil</Link></li>
            <li><Link to="/catalogue" className="hover:text-blue-400">Catalogue</Link></li>
            <li><Link to="/a-propos" className="hover:text-blue-400">À propos</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h3 className="footer-title">Informations légales</h3>
          <ul>
            <li><Link to="/conditions-utilisation" className="hover:text-blue-400">Conditions d'utilisation</Link></li>
            <li><Link to="/politique-confidentialite" className="hover:text-blue-400">Politique de confidentialité</Link></li>
            <li><Link to="/mentions-legales" className="hover:text-blue-400">Mentions légales</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h3 className="footer-title">Suivez-nous</h3>
          <div className="footer-social-icons mb-4">
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

      <div className="mt-4 pt-4 border-t border-gray-700 text-center text-xs">
        <p>&copy; {new Date().getFullYear()} Book Spot. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;
