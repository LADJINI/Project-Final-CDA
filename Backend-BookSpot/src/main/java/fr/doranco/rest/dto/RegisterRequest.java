package fr.doranco.rest.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class RegisterRequest {
    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    private String prenom;

    private String sexe;

    @NotNull(message = "La date de naissance est obligatoire")
    private LocalDate dateNaissance;

    @Email(message = "Veuillez fournir un email valide")
    @NotBlank(message = "L'email est obligatoire")
    private String email;

    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 12, message = "Le mot de passe doit contenir au moins 12 caractères")
    private String password;

    private String address;

    private String telephone;

    private Integer roleId;

    // Ajouter le champ pour le token reCAPTCHA
    @NotBlank(message = "Le token reCAPTCHA est obligatoire")
    private String recaptchaToken;
}
