import React, { useState } from 'react';
import LoginForm from '../auth/LoginForm';
import RegisterForm from '../auth/RegisterForm';
import { FaTimes } from 'react-icons/fa';

/**
 * Composant AuthModal pour gérer l'affichage d'une modal d'authentification.
 *
 * @param {Object} props - Propriétés du composant.
 * @param {boolean} props.isOpen - Indique si la modal est ouverte.
 * @param {Function} props.onClose - Fonction appelée pour fermer la modal.
 * 
 * @returns {JSX.Element|null} - Un élément JSX représentant la modal ou null si elle est fermée.
 */
const AuthModal = ({ isOpen, onClose }) => {
  // État pour déterminer si l'utilisateur est sur le formulaire de connexion
  const [isLogin, setIsLogin] = useState(true);

  // Si la modal n'est pas ouverte, retourner null pour ne rien afficher
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50" >
      <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl w-full mx-4">
        <div className="flex">
          {/* Image à gauche pour l'illustration, cachée sur mobile */}
          <div className="w-1/2 hidden md:block">
            <img 
              src={isLogin ? "/FondDePage.png.webp" : "/image-connexion.jpg"}
              alt="Illustration de connexion ou d'inscription" 
              className="object-cover w-full h-full"
            />
          </div>

          {/* Formulaire à droite, affiché sur tous les écrans */}
          <div className="w-full md:w-1/2 p-8">
            <div className="flex justify-end">
              {/* Bouton de fermeture de la modal */}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Fermer la modal"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-center">
              {isLogin ? 'Connexion' : 'Inscription'}
            </h2>
            <div className="mb-4">
              {/* Affichage du formulaire de connexion ou d'inscription selon l'état */}
              {isLogin ? <LoginForm onClose={onClose} showCaptcha={isLogin} />  : <RegisterForm onClose={onClose} />}
              </div>
            <div className="text-center">
              {/* Bouton pour basculer entre connexion et inscription */}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-blue-600 hover:underline"
              >
                {isLogin ? "Je n'ai pas de compte" : "J'ai déjà un compte"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
