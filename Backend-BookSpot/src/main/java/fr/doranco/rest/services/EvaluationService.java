package fr.doranco.rest.services;

import fr.doranco.rest.dto.EvaluationDto;
import fr.doranco.rest.entities.Evaluations;

import fr.doranco.rest.repository.IEvaluationRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EvaluationService {

    private final IEvaluationRepository evaluationRepository;

    public EvaluationService(IEvaluationRepository evaluationRepository) {
        this.evaluationRepository = evaluationRepository;
    }

    /**
     * Ajoute une nouvelle évaluation.
     *
     * @param evaluationDto le DTO de l'évaluation à ajouter
     * @return le DTO de l'évaluation ajoutée
     */
    @Transactional
    public EvaluationDto addEvaluation(EvaluationDto evaluationDto) {
        Evaluations evaluation = convertToEntity(evaluationDto);
        Evaluations savedEvaluation = evaluationRepository.save(evaluation);
        return convertToDto(savedEvaluation);
    }

    /**
     * Récupère toutes les évaluations.
     *
     * @return une liste de DTOs d'évaluations
     */
    public List<EvaluationDto> getAllEvaluations() {
        return evaluationRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Récupère une évaluation par son identifiant.
     *
     * @param id l'identifiant de l'évaluation
     * @return le DTO de l'évaluation trouvée, ou un Optional vide si non trouvée
     */
    public Optional<EvaluationDto> getEvaluationById(Long id) {
        return evaluationRepository.findById(id)
                .map(this::convertToDto);
    }

    /**
     * Met à jour une évaluation existante.
     *
     * @param id l'identifiant de l'évaluation à mettre à jour
     * @param evaluationDto le DTO de l'évaluation avec les nouvelles données
     * @return le DTO de l'évaluation mise à jour
     */
    @Transactional
    public EvaluationDto updateEvaluation(Long id, EvaluationDto evaluationDto) {
        Evaluations evaluation = evaluationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Évaluation non trouvée"));
        evaluation.setNote(evaluationDto.getNote());
        evaluation.setCommentaire(evaluationDto.getCommentaire());
        evaluation.setDateEvaluation(evaluationDto.getDateEvaluation());
        Evaluations updatedEvaluation = evaluationRepository.save(evaluation);
        return convertToDto(updatedEvaluation);
    }

    /**
     * Supprime une évaluation par son identifiant.
     *
     * @param id l'identifiant de l'évaluation à supprimer
     */
    @Transactional
    public void deleteEvaluation(Long id) {
        evaluationRepository.deleteById(id);
    }

    /**
     * Convertit un DTO en entité.
     *
     * @param evaluationDto le DTO à convertir
     * @return l'entité correspondante
     */
    private Evaluations convertToEntity(EvaluationDto evaluationDto) {
        Evaluations evaluation = new Evaluations();
        evaluation.setNote(evaluationDto.getNote());
        evaluation.setCommentaire(evaluationDto.getCommentaire());
        evaluation.setDateEvaluation(evaluationDto.getDateEvaluation());
        // Vous pouvez ajouter la conversion des relations ici si nécessaire
        return evaluation;
    }

    /**
     * Convertit une entité en DTO.
     *
     * @param evaluation l'entité à convertir
     * @return le DTO correspondant
     */
    private EvaluationDto convertToDto(Evaluations evaluation) {
        EvaluationDto dto = new EvaluationDto();
        dto.setId(evaluation.getId());
        dto.setNote(evaluation.getNote());
        dto.setCommentaire(evaluation.getCommentaire());
        dto.setDateEvaluation(evaluation.getDateEvaluation());
        return dto;
    }
}