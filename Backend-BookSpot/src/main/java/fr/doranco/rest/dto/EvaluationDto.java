package fr.doranco.rest.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * DTO (Data Transfer Object) pour représenter une évaluation.
 * 
 * Ce DTO est utilisé pour transférer les données d'évaluation entre
 * le backend et le frontend sans exposer les entités JPA directement.
 */
@Getter
@Setter
public class EvaluationDto {
    
    /**
     * Identifiant unique de l'évaluation.
     */
    private Long id;

    /**
     * Note attribuée à l'évaluation.
     */
    private Integer note;

    /**
     * Commentaire associé à l'évaluation.
     */
    private String commentaire;

    /**
     * Date et heure de l'évaluation.
     */
    private LocalDateTime dateEvaluation;

    // Vous pouvez ajouter d'autres champs si nécessaire
}