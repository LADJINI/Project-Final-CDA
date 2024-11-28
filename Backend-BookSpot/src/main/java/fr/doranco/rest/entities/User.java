package fr.doranco.rest.entities;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import java.util.ArrayList;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity

@Table(
	    name = "utilisateurs",
	    uniqueConstraints = @UniqueConstraint(name = "PK_UTILISATEURS", columnNames = "id_utilisateur"))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@NamedQueries({
    @NamedQuery(name = "User.findAllUsers", query = "SELECT u FROM User u")
})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_utilisateur")
    private Long id;

    @NotBlank(message = "Le nom est obligatoire")
    @Column(name = "nom" ,  length = 100, nullable = false)
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    @Column(name = "prenom", length = 100, nullable = false)
    private String prenom;

    @Column(name = "sexe")
    private String sexe;

    @NotNull(message = "La date de naissance est obligatoire")
    @Column(name = "date_naissance")
    private LocalDate dateNaissance;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Veuillez fournir un email valide")
    @Column(name = "email", length = 128, nullable = false, unique = true)
    private String email;
    
    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 12, message = "Le mot de passe doit contenir au moins 12 caractères")
    @Column(name = "mot_de_passe", nullable = false)
    private String password;

    @Column(name = "adresse", length = 255)
    private String address;

    @NotBlank(message = "Le téléphone est obligatoire")
    @Column(name = "telephone", length = 15, nullable = false)
    private String telephone;

    @Column(name = "date_inscription", nullable = false)
    private LocalDate registrationDate;
    
    @Builder.Default
    @Column(name = "actif",  nullable = false)
    private Boolean actif = false;  // Par défaut, l'utilisateur est inactif

    // Relation avec l'entité Role
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id")
    private Roles role;
    
    // Relation avec les livres (Book)
    //@Builder.Default
    //@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    //private Set<Book> books = new HashSet<>();

    // Relation avec les questions de sécurité (SecurityQuestion)
    @Builder.Default
    @OneToMany(mappedBy = "user")
    private List<SecurityQuestions> securityQuestions = new ArrayList<>();

    // Relation avec les évaluations (Evaluation)
    @Builder.Default
    @OneToMany(mappedBy = "user")
    private List<Evaluations> evaluations = new ArrayList<>();

    // Relation avec les transactions (Transaction)
    @Builder.Default
    @OneToMany(mappedBy = "user")
    private List<Transaction> transaction = new ArrayList<>();
}
