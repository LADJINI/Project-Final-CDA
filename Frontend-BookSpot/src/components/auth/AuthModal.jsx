import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { FaTimes } from 'react-icons/fa'; // Importez l'icône de croix

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="absolute top-0 right-0 mt-4 mr-4">
          <button
            onClick={onClose}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {isLogin ? 'Connexion' : 'Inscription'}
          </h3>
          <div className="mt-2 px-7 py-3">
            {isLogin ? <LoginForm /> : <RegisterForm />}
          </div>
          <div className="mt-4">
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
  );
};

export default AuthModal;