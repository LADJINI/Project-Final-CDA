/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#155e75', // Ajoutez cette ligne pour la couleur personnalisée
      },
    },
  },
  plugins: [],
}

