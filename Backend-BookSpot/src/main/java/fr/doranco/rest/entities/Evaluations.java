package fr.doranco.rest.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity

@Table(
	    name = "evaluations",
	    uniqueConstraints = @UniqueConstraint(name = "PK_EVALUATIONS", columnNames = "id_evaluation"))
@Getter
@Setter
public class Evaluations {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_evaluation")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "Id_livre")
    private Book book;

    @ManyToOne
    @JoinColumn(name = "id_utilisateur")
    private User user;

    @Column(name = "note", nullable = false)
    private Integer note;

    @Column(name = "commentaire", length = 250)
    private String commentaire;

    @Column(name = "date_evaluation", nullable = false)
    private LocalDateTime dateEvaluation;
}
