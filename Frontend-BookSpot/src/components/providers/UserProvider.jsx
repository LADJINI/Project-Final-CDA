// src/providers/UserProvider.jsx
import React, { createContext, useContext, useState } from 'react';

// Créez le contexte
export const UserContext = createContext();

// Créez un provider pour le contexte
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
