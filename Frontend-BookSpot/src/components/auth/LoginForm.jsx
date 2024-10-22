import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * Schéma de validation pour le formulaire de connexion.
 */
const schema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(12, { message: "Le mot de passe doit contenir au moins 12 caractères" }),
});

const LoginForm = ({ onClose }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  /**
   * Gère la soumission du formulaire de connexion.
   * @param {Object} data - Les données du formulaire.
   */
  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:8086/api/auth/login', data);
      await login(response.data);
      onClose();
    } catch (error) {
      setError('Erreur lors de la connexion. Veuillez vérifier vos identifiants.');
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

      <div className="mb-4 ">
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