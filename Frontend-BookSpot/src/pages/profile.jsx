// src/components/pages/Profile.jsx
import React, { useContext } from 'react';
import { UserContext }  from '../providers/UserProvider';

const Profile = () => {
  const { user, logout } = useContext(UserContext);

  return (
    <div className="container mx-auto p-4">
      {user ? (
        <div>
          <h2 className="text-2xl font-bold">Profil</h2>
          <p><strong>Nom:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button onClick={logout} className="btn">Déconnexion</button>
        </div>
      ) : (
        <p>Vous devez être connecté pour voir cette page.</p>
      )}
    </div>
  );
};

export default Profile;
