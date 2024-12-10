package fr.doranco.rest.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Classe DTO pour la gestion des demandes de connexion (login).
 * Cette classe représente les données nécessaires pour qu'un utilisateur puisse se connecter.
 * 
 * Elle contient trois champs :
 * - email : l'adresse email de l'utilisateur.
 * - password : le mot de passe de l'utilisateur.
 * - recaptchaToken : le token reCAPTCHA fourni par le client.
 */
public class LoginRequest {

    @NotBlank(message = "L'email est obligatoire")  // Validation pour s'assurer que l'email n'est pas vide
    @Email(message = "Veuillez fournir une adresse email valide")  // Validation pour vérifier que l'email est valide
    private String email;

    @NotBlank(message = "Le mot de passe est obligatoire")  // Validation pour s'assurer que le mot de passe n'est pas vide
    private String password;

    @NotBlank(message = "Le token reCAPTCHA est obligatoire")  // Validation pour s'assurer que le token n'est pas vide
    private String recaptchaToken;

    /**
     * Retourne l'adresse email de l'utilisateur.
     * 
     * @return L'email de l'utilisateur.
     */
    public String getEmail() {
        return email;
    }

    public String getUsername() {
        return email;
    }

    /**
     * Définit l'adresse email de l'utilisateur.
     * 
     * @param email L'email à définir pour l'utilisateur.
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * Retourne le mot de passe de l'utilisateur.
     * 
     * @return Le mot de passe de l'utilisateur.
     */
    public String getPassword() {
        return password;
    }

    /**
     * Définit le mot de passe de l'utilisateur.
     * 
     * @param password Le mot de passe à définir pour l'utilisateur.
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * Retourne le token reCAPTCHA fourni par le client.
     * 
     * @return Le token reCAPTCHA.
     */
    public String getRecaptchaToken() {
        return recaptchaToken;
    }

    /**
     * Définit le token reCAPTCHA.
     * 
     * @param recaptchaToken Le token reCAPTCHA à définir.
     */
    public void setRecaptchaToken(String recaptchaToken) {
        this.recaptchaToken = recaptchaToken;
    }
}
