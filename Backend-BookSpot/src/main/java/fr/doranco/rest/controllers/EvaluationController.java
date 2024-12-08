package fr.doranco.rest.controllers;

import fr.doranco.rest.dto.EvaluationDto;
import fr.doranco.rest.services.EvaluationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Contrôleur REST pour gérer les évaluations.
 * 
 * Ce contrôleur expose des endpoints pour ajouter, récupérer, mettre à jour et supprimer des évaluations.
 */
@CrossOrigin(origins = "http://localhost:8086")
@RestController
@RequestMapping("/api/evaluations")
public class EvaluationController {

    private final EvaluationService evaluationService;

    public EvaluationController(EvaluationService evaluationService) {
        this.evaluationService = evaluationService;
    }

    /**
     * Ajoute une nouvelle évaluation.
     *
     * @param evaluationDto le DTO de l'évaluation à ajouter
     * @return la réponse contenant le DTO de l'évaluation ajoutée
     */
    @PostMapping
    public ResponseEntity<EvaluationDto> addEvaluation(@RequestBody EvaluationDto evaluationDto) {
        EvaluationDto createdEvaluation = evaluationService.addEvaluation(evaluationDto);
        return new ResponseEntity<>(createdEvaluation, HttpStatus.CREATED);
    }

    /**
     * Récupère toutes les évaluations.
     *
     * @return la réponse contenant la liste des DTOs d'évaluations
     */
    @GetMapping
    public ResponseEntity<List<EvaluationDto>> getAllEvaluations() {
        List<EvaluationDto> evaluations = evaluationService.getAllEvaluations();
        return new ResponseEntity<>(evaluations, HttpStatus.OK);
    }

    /**
     * Récupère une évaluation par son identifiant.
     *
     * @param id l'identifiant de l'évaluation
     * @return la réponse contenant le DTO de l'évaluation trouvée, ou une réponse 404 si non trouvée
     */
    @GetMapping("/{id}")
    public ResponseEntity<EvaluationDto> getEvaluationById(@PathVariable Long id) {
        Optional<EvaluationDto> evaluationDto = evaluationService.getEvaluationById(id);
        return evaluationDto.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    /**
     * Met à jour une évaluation existante.
     *
     * @param id l'identifiant de l'évaluation à mettre à jour
     * @param evaluationDto le DTO de l'évaluation avec les nouvelles données
     * @return la réponse contenant le DTO de l'évaluation mise à jour
     */
    @PutMapping("/{id}")
    public ResponseEntity<EvaluationDto> updateEvaluation(@PathVariable Long id, @RequestBody EvaluationDto evaluationDto) {
        EvaluationDto updatedEvaluation = evaluationService.updateEvaluation(id, evaluationDto);
        return ResponseEntity.ok(updatedEvaluation);
    }

    /**
     * Supprime une évaluation par son identifiant.
     *
     * @param id l'identifiant de l'évaluation à supprimer
     * @return la réponse 204 No Content si la suppression a réussi
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvaluation(@PathVariable Long id) {
        evaluationService.deleteEvaluation(id);
        return ResponseEntity.noContent().build();
    }
}