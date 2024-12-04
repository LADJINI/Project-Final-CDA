# Étape 1: Construire l'application avec Node.js
FROM node:18 AS build
WORKDIR /app

# Installer les dépendances et construire
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2: Utiliser Nginx pour servir les fichiers
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Exposer le port du frontend
EXPOSE 80

# Lancer Nginx
CMD ["nginx", "-g", "daemon off;"]
