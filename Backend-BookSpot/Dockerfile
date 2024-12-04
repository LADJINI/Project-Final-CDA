# Étape 1: Utiliser une image Maven pour la compilation
FROM maven:3.9.5-eclipse-temurin-17 AS build
WORKDIR /app

# Copier les fichiers nécessaires
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src

#Compiler le projet
RUN mvn package -DskipTests

# Étape 2: Utiliser une image JRE pour exécuter l'application
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copier l'application compilée
COPY --from=build /app/target/*.jar app.jar

# Exposer le port du backend
EXPOSE 8086

# Démarrer l'application
ENTRYPOINT ["java", "-jar", "app.jar"]
