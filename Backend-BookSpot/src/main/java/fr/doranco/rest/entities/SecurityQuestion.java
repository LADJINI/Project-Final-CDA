package fr.doranco.rest.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "question_securite")
@Getter
@Setter
public class SecurityQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_question")
    private Integer id;
    

    @Column(name = "question", length = 250, nullable = false)
    private String question;

    @Column(name = "reponse", length = 50, nullable = false)
    private String answer;
    
    
    @ManyToOne
    @JoinColumn(name = "id_utilisateur")
    private User user;
}
