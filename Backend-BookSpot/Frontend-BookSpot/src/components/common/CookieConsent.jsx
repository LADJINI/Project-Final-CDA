import React, { useState, useEffect } from 'react';
import CookiePreferences from './CookiePreferences';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  useEffect(() => {
    // Pour le développement, on affiche toujours le pop-up
    setIsVisible(true);
    console.log("CookieConsent mounted");

    // Uncomment this for production
    // const consent = localStorage.getItem('cookieConsent');
    // if (!consent) {
    //   setIsVisible(true);
    // }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
    console.log("Cookies accepted");
  };

  const handlePreferences = () => {
    setIsPreferencesOpen(true);
    console.log("Preferences opened");
  };

  const handlePreferencesSave = (preferences) => {
    console.log('Préférences sauvegardées:', preferences);
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  console.log("isVisible:", isVisible); // Pour le débogage

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 p-4 shadow-md z-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-700 mb-4 md:mb-0 md:mr-4">
            Nous utilisons des cookies essentiels pour faire fonctionner notre site. Avec votre consentement, nous pouvons également utiliser des cookies non essentiels.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={handleAccept}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Accepter
            </button>
            <button
              onClick={handlePreferences}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Préférences
            </button>
          </div>
        </div>
      </div>
      <CookiePreferences
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        onSave={handlePreferencesSave}
      />
    </>
  );
};

export default CookieConsent;