// src/components/common/CookiePreferences.jsx
import React, { useState } from 'react';

const CookiePreferences = ({ isOpen, onClose, onSave }) => {
  const [preferences, setPreferences] = useState({
    essential: true, // Toujours activé
    functional: false,
    analytics: false,
    advertising: false,
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setPreferences(prev => ({ ...prev, [name]: checked }));
  };

  const handleSave = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    onSave(preferences);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="cookie-preferences-modal">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h2 className="text-lg font-bold mb-4">Préférences des cookies</h2>
        <div className="space-y-4">
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="essential"
                checked={preferences.essential}
                disabled
                className="mr-2"
              />
              <span>Cookies essentiels (toujours activés)</span>
            </label>
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="functional"
                checked={preferences.functional}
                onChange={handleChange}
                className="mr-2"
              />
              <span>Cookies fonctionnels</span>
            </label>
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="analytics"
                checked={preferences.analytics}
                onChange={handleChange}
                className="mr-2"
              />
              <span>Cookies d'analyse</span>
            </label>
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="advertising"
                checked={preferences.advertising}
                onChange={handleChange}
                className="mr-2"
              />
              <span>Cookies publicitaires</span>
            </label>
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookiePreferences;