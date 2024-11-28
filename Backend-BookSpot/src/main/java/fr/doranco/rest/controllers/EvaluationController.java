package fr.doranco.rest.controllers;

import fr.doranco.rest.dto.EvaluationDto;
import fr.doranco.rest.entities.Evaluations;
import fr.doranco.rest.services.EvaluationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Contrôleur pour gérer les évaluations.
 */

@CrossOrigin(origins = "http://localhost:8086")
@RestController
@RequestMapping("/evaluations")
public class EvaluationController {

    private final EvaluationService evaluationService;

    public EvaluationController(EvaluationService evaluationService) {
        this.evaluationService = evaluationService;
    }

    /**
     * Ajoute une nouvelle évaluation.
     *
     * @param evaluationDto Les données de l'évaluation à ajouter.
     * @return Réponse HTTP avec l'évaluation ajoutée.
     */
    @PostMapping
    public ResponseEntity<EvaluationDto> addEvaluation(@RequestBody EvaluationDto evaluationDto) {
        EvaluationDto createdEvaluation = evaluationService.addEvaluation(evaluationDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEvaluation);
    }

    /**
     * Récupère toutes les évaluations.
     *
     * @return Liste des évaluations.
     */
    @GetMapping
    public ResponseEntity<List<EvaluationDto>> getAllEvaluations() {
        List<EvaluationDto> evaluations = evaluationService.getAllEvaluations();
        return ResponseEntity.ok(evaluations);
    }

    /**
     * Récupère une évaluation par son identifiant.
     *
     * @param id L'identifiant de l'évaluation à récupérer.
     * @return Réponse HTTP avec l'évaluation ou une erreur 404 si non trouvée.
     */
    @GetMapping("/{id}")
    public ResponseEntity<EvaluationDto> getEvaluationById(@PathVariable Long id) {
        EvaluationDto evaluationDto = evaluationService.getEvaluationById(id);
        return evaluationDto != null ? ResponseEntity.ok(evaluationDto) : ResponseEntity.notFound().build();
    }

    /**
     * Met à jour une évaluation existante.
     *
     * @param id             L'identifiant de l'évaluation à mettre à jour.
     * @param evaluationDto  Les nouvelles données de l'évaluation.
     * @return Réponse HTTP avec l'évaluation mise à jour ou une erreur 404 si non trouvée.
     */
    @PutMapping("/{id}")
    public ResponseEntity<EvaluationDto> updateEvaluation(@PathVariable Long id, @RequestBody EvaluationDto evaluationDto) {
        EvaluationDto updatedEvaluation = evaluationService.updateEvaluation(id, evaluationDto);
        return updatedEvaluation != null ? ResponseEntity.ok(updatedEvaluation) : ResponseEntity.notFound().build();
    }

    /**
     * Supprime une évaluation par son identifiant.
     *
     * @param id L'identifiant de l'évaluation à supprimer.
     * @return Réponse HTTP indiquant le succès ou l'échec de la suppression.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvaluation(@PathVariable Long id) {
        boolean isDeleted = evaluationService.deleteEvaluation(id);
        return isDeleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
