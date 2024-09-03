// src/components/elements/SignupForm.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  firstName: z.string().min(1, 'Nom requis'),
  lastName: z.string().min(1, 'Prénom requis'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe trop court'),
  confirmPassword: z.string().min(6, 'Confirmation requise').refine((val, ctx) => val === ctx.parent.password, 'Les mots de passe ne correspondent pas'),
  address: z.string().min(1, 'Adresse requise'),
  phoneNumber: z.string().min(10, 'Numéro de téléphone invalide'),
});

export default function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
  const [backEndError, setBackEndError] = useState('');

  const onSubmit = async (data) => {
    try {
      // Simuler un appel à une API d'inscription
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setBackEndError(errorData.message || 'Erreur d\'inscription');
      } else {
        // Rediriger vers la page de connexion après une inscription réussie
        navigate('/loginForm');
      }
    } catch (error) {
      setBackEndError('Erreur de connexion au serveur');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">S'inscrire</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label>Nom</label>
          <input
            type="text"
            {...register('firstName')}
            className="input"
          />
          {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
        </div>
        <div>
          <label>Prénom</label>
          <input
            type="text"
            {...register('lastName')}
            className="input"
          />
          {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
        </div>
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
        <div>
          <label>Confirmation du mot de passe</label>
          <input
            type="password"
            {...register('confirmPassword')}
            className="input"
          />
          {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
        </div>
        <div>
          <label>Adresse</label>
          <input
            type="text"
            {...register('address')}
            className="input"
          />
          {errors.address && <p className="text-red-500">{errors.address.message}</p>}
        </div>
        <div>
          <label>Numéro de téléphone</label>
          <input
            type="text"
            {...register('phoneNumber')}
            className="input"
          />
          {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber.message}</p>}
        </div>
        {backEndError && <p className="text-red-500">{backEndError}</p>}
        <button type="submit" className="btn">S'inscrire</button>
      </form>
    </div>
  );
}
