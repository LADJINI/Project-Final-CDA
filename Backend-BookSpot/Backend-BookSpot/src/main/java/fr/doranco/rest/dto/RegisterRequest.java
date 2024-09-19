package fr.doranco.rest.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Data
public class RegisterRequest {
    private String nom;
    private String prenom;
    private String sexe;
    private LocalDate dateNaissance;
    private String email;
    private String password;
    private String address;
    private String telephone;
    private Integer roleId;

    // Vous pouvez omettre les champs suivants car ils seront généralement définis par le système :
    // private Long id;
    // private LocalDate registrationDate;
    // private Boolean actif;
    
    // Constructeur, getters et setters sont générés par Lombok
}