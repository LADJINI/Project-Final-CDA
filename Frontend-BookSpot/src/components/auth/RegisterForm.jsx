import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Schéma de validation avec Zod
const schema = z.object({
  nom: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  prenom: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{12,45}$/, {
    message: "Le mot de passe doit contenir entre 12 et 45 caractères, incluant au moins une majuscule, une minuscule, un chiffre et un caractère spécial"
  }),
  confirmPassword: z.string(),
  sexe: z.enum(['homme', 'femme'], { message: "Veuillez sélectionner votre sexe" }),
  dateNaissance: z.string().refine((date) => new Date(date) <= new Date(), {
    message: "La date de naissance ne peut pas être dans le futur"
  }),
  telephone: z.string().regex(/^(\+33|0)[1-9](\d{2}){4}$/, {
    message: "Numéro de téléphone invalide"
  }),
  adresse: z.string().min(5, { message: "L'adresse doit contenir au moins 5 caractères" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

const RegisterForm = ({ onClose }) => {
  const navigate = useNavigate(); // Initialiser useNavigate
  const { signup } = useAuth(); // Utilisation du contexte d'authentification
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  // Fonction pour gérer la soumission du formulaire d'inscription
  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:8086/api/auth/register', data);
      console.log('Inscription réussie', response.data);
      await signup(response.data); // Mettre à jour le contexte d'authentification
      alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      navigate('/'); // Redirection vers la page d'accueil
      onClose(); // Fermer le modal
    } catch (error) {
      console.error('Erreur inscription', error.response ? error.response.data : error.message);
      alert('Erreur lors de l\'inscription : ' + (error.response ? error.response.data : error.message));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto p-4 bg-gray-800 rounded-md shadow-lg">
      <input {...register("nom")} placeholder="Nom" className="w-full px-3 py-2 border rounded bg-gray-700 text-white" />
      {errors.nom && <p className="text-red-500 text-xs">{errors.nom.message}</p>}

      <input {...register("prenom")} placeholder="Prénom" className="w-full px-3 py-2 border rounded bg-gray-700 text-white" />
      {errors.prenom && <p className="text-red-500 text-xs">{errors.prenom.message}</p>}

      <input {...register("email")} type="email" placeholder="Email" className="w-full px-3 py-2 border rounded bg-gray-700 text-white" />
      {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}

      <input {...register("password")} type="password" placeholder="Mot de passe" className="w-full px-3 py-2 border rounded bg-gray-700 text-white" />
      {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}

      <input {...register("confirmPassword")} type="password" placeholder="Confirmer le mot de passe" className="w-full px-3 py-2 border rounded bg-gray-700 text-white" />
      {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}

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
        S'inscrire
      </button>
    </form>
  );
};

export default RegisterForm;
