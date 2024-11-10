import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';  // Contexte pour l'utilisateur connecté
import { useNavigate } from 'react-router-dom';

/**
 * Schéma de validation pour le formulaire de mise à jour du profil utilisateur
 */
const schema = z.object({
  nom: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  prenom: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Email invalide" }),
  sexe: z.enum(['homme', 'femme'], { message: "Veuillez sélectionner votre sexe" }),
  dateNaissance: z.string().refine((date) => new Date(date) <= new Date(), {
    message: "La date de naissance ne peut pas être dans le futur"
  }),
  telephone: z.string().regex(/^(\+33|0)[1-9](\d{2}){4}$/, {
    message: "Numéro de téléphone invalide"
  }),
  adresse: z.string().min(5, { message: "L'adresse doit contenir au moins 5 caractères" }),
});

const UserProfileForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();  // Contexte pour récupérer les infos de l'utilisateur connecté.
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (!user?.email) {
      alert('Utilisateur non connecté.');
      navigate('/login');  // Redirection si l'utilisateur n'est pas connecté
      return;
    }

    // Récupérer les données de l'utilisateur depuis l'API en utilisant l'email de l'utilisateur connecté
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8086/api/users/email/${user.email}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`  // Assurez-vous que `user.token` contient un jeton valide
          }
        });
        setInitialData(response.data);
      } catch (error) {
        console.error("Erreur de récupération des données utilisateur", error);
        alert("Erreur lors du chargement des données utilisateur.");
      }
    };

    fetchUserData();
  }, [user?.email, user?.token, navigate]);  // Déclenche la requête lorsque l'email ou le token change

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });

  /**
   * Gère la soumission du formulaire de mise à jour du profil.
   * @param {Object} data - Les données du formulaire.
   */
  const onSubmit = async (data) => {
    try {
      const response = await axios.put(`http://localhost:8086/api/users/email/${user.email}`, data, {
        headers: {
          'Authorization': `Bearer ${user.token}`  // Inclure le token dans l'en-tête pour l'authentification
        }
      });
      console.log('Mise à jour réussie', response.data);
      alert('Profil mis à jour avec succès !');
      navigate(`/profile/${user.email}`); // Redirection vers le profil mis à jour
    } catch (error) {
      console.error('Erreur mise à jour', error.response ? error.response.data : error.message);
      alert('Erreur lors de la mise à jour du profil : ' + (error.response ? error.response.data : error.message));
    }
  };

  // Affichage pendant le chargement des données utilisateur
  if (!initialData) {
    return <div>Chargement des données...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto p-4 bg-gray-800 rounded-md shadow-lg">
      <input {...register("nom")} placeholder="Nom" className="w-full px-3 py-2 border rounded bg-gray-700 text-white" />
      {errors.nom && <p className="text-red-500 text-xs">{errors.nom.message}</p>}

      <input {...register("prenom")} placeholder="Prénom" className="w-full px-3 py-2 border rounded bg-gray-700 text-white" />
      {errors.prenom && <p className="text-red-500 text-xs">{errors.prenom.message}</p>}

      <input {...register("email")} type="email" placeholder="Email" className="w-full px-3 py-2 border rounded bg-gray-700 text-white" />
      {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}

      <div className="flex space-x-4">
        <label className="inline-flex items-center">
          <input {...register("sexe")} type="radio" value="homme" className="form-radio text-blue-600" />
          <span className="ml-2">Homme</span>
        </label>
        <label className="inline-flex items-center">
          <input {...register("sexe")} type="radio" value="femme" className="form-radio text-blue-600" />
          <span className="ml-2">Femme</span>
        </label>
      </div>
      {errors.sexe && <p className="text-red-500 text-xs">{errors.sexe.message}</p>}

      <input {...register("dateNaissance")} type="date" className="w-full px-3 py-2 border rounded bg-gray-700 text-white" />
      {errors.dateNaissance && <p className="text-red-500 text-xs">{errors.dateNaissance.message}</p>}

      <input {...register("telephone")} placeholder="Téléphone" className="w-full px-3 py-2 border rounded bg-gray-700 text-white" />
      {errors.telephone && <p className="text-red-500 text-xs">{errors.telephone.message}</p>}

      <input {...register("adresse")} placeholder="Adresse" className="w-full px-3 py-2 border rounded bg-gray-700 text-white" />
      {errors.adresse && <p className="text-red-500 text-xs">{errors.adresse.message}</p>}

      <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
        Mettre à jour le profil
      </button>
    </form>
  );
};

export default UserProfileForm;
