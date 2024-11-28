package fr.doranco.rest.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity

@Table(
	    name = "questions_securite",
	    uniqueConstraints = @UniqueConstraint(name = "PK_QUESTIONS_SECURITE", columnNames = "id_question"))
@Getter
@Setter
public class SecurityQuestions {
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
