import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { FaTimes } from 'react-icons/fa';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center" id="my-modal">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl w-full mx-4">
        <div className="flex">
          {/* Image à gauche */}
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
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-center">
              {isLogin ? 'Connexion' : 'Inscription'}
            </h2>
            <div className="mb-4">
              {isLogin ? <LoginForm /> : <RegisterForm />}
            </div>
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