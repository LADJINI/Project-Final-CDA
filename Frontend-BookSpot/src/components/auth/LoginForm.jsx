import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; // Assurez-vous d'importer le contexte d'authentification

// Schéma de validation avec Zod
const schema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(12, { message: "Le mot de passe doit contenir au moins 12 caractères" }),
});

const LoginForm = ({ onClose }) => {
  const { login } = useAuth(); // Utilisation du contexte d'authentification
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  // Fonction appelée lors de la soumission du formulaire
  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:8086/api/auth/login', {
        email: data.email,
        password: data.password
      });
      await login(response.data); // Appeler la fonction de connexion
      onClose(); // Fermer le modal après connexion
    } catch (error) {
      alert('Erreur lors de la connexion. Veuillez vérifier vos identifiants.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto p-4 bg-gray-800 rounded-md shadow-lg">
      <div className="mb-4">
        <input
          {...register("email")}
          type="email"
          placeholder="Email"
          className="mt-2 px-3 py-2 border rounded bg-gray-700 text-white w-full"
        />
        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
      </div>

      <div className="mb-4">
        <input
          {...register("password")}
          type="password"
          placeholder="Mot de passe"
          className="mt-2 px-3 py-2 border rounded bg-gray-700 text-white w-full"
        />
        {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
      </div>

      <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
        Se connecter
      </button>
    </form>
  );
};

export default LoginForm;
