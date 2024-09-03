// src/components/elements/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(12, 'Mot de passe trop court'),
});

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
  const navigate = useNavigate();
  const [backEndError, setBackEndError] = useState('');

  const onSubmit = async (data) => {
    try {
      // Simuler un appel à une API de connexion
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setBackEndError(errorData.message || 'Erreur de connexion');
      } else {
        // Rediriger vers le profil après une connexion réussie
        navigate('/profile');
      }
    } catch (error) {
      setBackEndError('Erreur de connexion au serveur');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Se connecter</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label>Email</label>
          <input
            type="email"
            {...register('email')}
            className="input"
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <label>Mot de passe</label>
          <input
            type="password"
            {...register('password')}
            className="input"
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>
        {backEndError && <p className="text-red-500">{backEndError}</p>}
        <button type="submit" className="btn">Se connecter</button>
      </form>
    </div>
  );
}
