import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(12, { message: "Le mot de passe doit contenir au moins 12 caractères" }),
});

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = (data) => {
    console.log(data);
    // Ici, vous pouvez ajouter la logique pour envoyer les données au backend
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("email")}
        type="email"
        placeholder="Email"
        className="mt-2 px-3 py-2 border rounded-md w-full"
      />
      {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}

      <input
        {...register("password")}
        type="password"
        placeholder="Mot de passe"
        className="mt-2 px-3 py-2 border rounded-md w-full"
      />
      {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}

      <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
        Se connecter
      </button>
    </form>
  );
};

export default LoginForm;