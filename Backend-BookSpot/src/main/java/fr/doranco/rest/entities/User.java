package fr.doranco.rest.entities;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


import java.util.ArrayList;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "utilisateurs")
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

    @Column(name = "nom", length = 50, nullable = false)
    private String nom;

    @Column(name = "prenom", length = 50, nullable = false)
    private String prenom;

    @Column(name = "sexe")
    private String sexe;

    @Column(name = "date_naissance", nullable = false)
    private LocalDate dateNaissance;

    @Column(name = "email", length = 128, nullable = false, unique = true)
    private String email;
    
    @Column(name = "mot_de_passe", nullable = false)
    private String password;
    @PrePersist
    @PreUpdate
    private void validatePassword() {
        if (password == null || password.trim().isEmpty()) {
            throw new IllegalStateException("Password cannot be null or empty");
        }
    }

    @Column(name = "adresse", length = 255)
    private String address;

    @Column(name = "telephone", length = 15, nullable = false)
    private String telephone;

    @Column(name = "date_inscription", nullable = false)
    private LocalDate registrationDate;
    
   
    @Builder.Default
    @Column(name = "actif",  nullable = false)
    private Boolean actif = false; // Par défaut non actif

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id")
    private Role role;
    
    @Builder.Default
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Book> books = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "user")
    private List<SecurityQuestion> securityQuestions = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "user")
    private List<Evaluation> evaluations = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "user")
    private List<Transaction> transactions = new ArrayList<>();

    // Méthode pour obtenir le nom d'utilisateur
    public String getUsername() {
        return this.email;  // Utilise l'email comme nom d'utilisateur
    }
}