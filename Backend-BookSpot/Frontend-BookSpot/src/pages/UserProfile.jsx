import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.token) {
          throw new Error('Utilisateur non authentifié');
        }

        const config = {
          headers: { Authorization: `Bearer ${user.token}` }
        };

        const response = await axios.get('/api/user/data', config);
        setUserData(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur :", error);
        setError('Erreur lors de la récupération des données utilisateur.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!userData) return <p>Aucune donnée disponible</p>;

  return (
    <div className="max-w-md mx-auto p-4 border rounded-md shadow-lg bg-white">
      <h1 className="text-2xl font-bold mb-4">Profil de l'utilisateur</h1>
      {userData.photo && (
        <img src={userData.photo} alt="Photo de profil" className="w-24 h-24 rounded-full mb-4" />
      )}
      <p><strong>Nom :</strong> {userData.nom}</p>
      <p><strong>Prénom :</strong> {userData.prenom}</p>
      <p><strong>Email :</strong> {userData.email}</p>
      <p><strong>Téléphone :</strong> {userData.telephone}</p>
      <p><strong>Adresse :</strong> {userData.adresse}</p>
      <p><strong>Date de naissance :</strong> {new Date(userData.dateNaissance).toLocaleDateString()}</p>
      <p><strong>Sexe :</strong> {userData.sexe === 'homme' ? 'Homme' : 'Femme'}</p>
      <p><strong>Inscrit depuis :</strong> {new Date(userData.createdAt).toLocaleDateString()}</p>
      <p><strong>Dernière connexion :</strong> {userData.lastLogin ? new Date(userData.lastLogin).toLocaleDateString() : 'Jamais'}</p>
    </div>
  );
};

export default UserProfile;
