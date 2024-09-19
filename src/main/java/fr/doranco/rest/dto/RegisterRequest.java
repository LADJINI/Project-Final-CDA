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
    @Size(min = 12, message = "Le mot de passe doit contenir au moins 6 caractères")
    private String password;

    private String address;

    private String telephone;

    private Integer roleId;
}

    // Vous pouvez omettre les champs suivants car ils seront généralement définis par le système :
    // private Long id;
    // private LocalDate registrationDate;
    // private Boolean actif;
    
    // Constructeur, getters et setters sont générés par Lombok


 
