import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { FaTimes } from 'react-icons/fa';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  // Fermer le modal avec la touche 'Escape'
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();  // Fermer le modal lorsque l'utilisateur appuie sur 'Escape'
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    // Nettoyage de l'événement lorsque le modal est fermé
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Si le modal n'est pas ouvert, ne rien afficher
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center" id="my-modal">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl w-full mx-4">
        <div className="flex">
          {/* Image à gauche, uniquement visible sur les écrans md (moyen et plus) */}
          <div className="w-1/2 hidden md:block">
            <img 
              src={isLogin ? "/FondDePage.png.webp" : "/image-connexion.jpg"}
              alt="Illustration" 
              className="object-cover w-full h-full"
            />
          </div>

          {/* Formulaire à droite */}
          <div className="w-full md:w-1/2 p-8">
            <div className="flex justify-end">
              {/* Bouton pour fermer le modal */}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            {/* Titre basé sur l'état (connexion/inscription) */}
            <h2 className="text-2xl font-bold mb-4 text-center">
              {isLogin ? 'Connexion' : 'Inscription'}
            </h2>

            {/* Contenu du formulaire, affiche soit le formulaire de connexion soit d'inscription */}
            <div className="mb-4">
              {isLogin ? <LoginForm onClose={onClose} /> : <RegisterForm onClose={onClose} />}
            </div>

            {/* Bouton pour basculer entre connexion et inscription */}
            <div className="text-center">
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
