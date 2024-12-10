package fr.doranco.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

import fr.doranco.rest.entities.User;
import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Data Transfer Object pour les utilisateurs.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private Long id;

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

    // Considérer de ne pas exposer le mot de passe
    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 12, message = "Le mot de passe doit contenir au moins 12 caractères")
    private String password;
    
   
    private String address;

    @NotBlank(message = "Le téléphone est obligatoire")
    private String telephone;
    
    
    
    private LocalDate registrationDate;

    private Boolean actif;

    private Long roleId; // Assurez-vous que cela correspond à votre logique métier

    // Constructeur qui prend un objet User
    public UserDto(User user) {
        this.id = user.getId();
        this.nom = user.getNom();
        this.prenom = user.getPrenom();
        this.sexe = user.getSexe();
        this.dateNaissance = user.getDateNaissance();
        this.email = user.getEmail();
        this.password = user.getPassword(); // À considérer
        this.address = user.getAddress();
        this.telephone = user.getTelephone();
        this.registrationDate = user.getRegistrationDate();
        this.actif = user.getActif();
        this.roleId = user.getRole() != null ? user.getRole().getId() : null; // Assurez-vous que cela correspond à votre logique métier
    }
}