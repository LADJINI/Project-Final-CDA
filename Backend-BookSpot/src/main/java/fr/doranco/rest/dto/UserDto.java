package fr.doranco.rest.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;


@Getter
@Setter
@Data
public class UserDto {
    private Long id;
    private String nom;
    private String prenom;
    private String sexe;
    private LocalDate dateNaissance;
    private String email;
    private String password;
    private String address;
    private String telephone;
    private LocalDate registrationDate;
    private Boolean actif;
    private Integer roleId;
   // private List<BookDto> books;
    
}
