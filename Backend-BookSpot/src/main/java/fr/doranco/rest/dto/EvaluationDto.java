package fr.doranco.rest.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Data Transfer Object pour l'évaluation.
 */
@Getter
@Setter
public class EvaluationDto {

    private Long id; // Identifiant de l'évaluation
    private Long bookId; // Identifiant du livre évalué
    private Long userId; // Identifiant de l'utilisateur ayant effectué l'évaluation
    private Integer note; // Note donnée à l'évaluation
    private String commentaire; // Commentaire de l'évaluation
    private LocalDateTime dateEvaluation; // Date de l'évaluation
}
