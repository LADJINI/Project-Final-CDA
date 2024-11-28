package fr.doranco.rest.services;

import fr.doranco.rest.dto.EvaluationDto;
import fr.doranco.rest.entities.Evaluations;
import fr.doranco.rest.repository.IEvaluationRepository;


import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service pour gérer les évaluations.
 */
@Service
@Transactional
public class EvaluationService {

    private final IEvaluationRepository evaluationRepository;

    public EvaluationService(IEvaluationRepository evaluationRepository) {
        this.evaluationRepository = evaluationRepository;
    }

    /**
     * Ajoute une nouvelle évaluation.
     *
     * @param evaluationDto Les données de l'évaluation à ajouter.
     * @return L'évaluation créée sous forme de DTO.
     */
    public EvaluationDto addEvaluation(EvaluationDto evaluationDto) {
        Evaluations evaluation = convertToEntity(evaluationDto);
        Evaluations savedEvaluation = evaluationRepository.save(evaluation);
        return convertToDto(savedEvaluation);
    }

    /**
     * Récupère toutes les évaluations.
     *
     * @return Une liste de toutes les évaluations sous forme de DTO.
     */
    public List<EvaluationDto> getAllEvaluations() {
        List<Evaluations> evaluations = evaluationRepository.findAll();
        return evaluations.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Récupère une évaluation par son identifiant.
     *
     * @param id L'identifiant de l'évaluation à récupérer.
     * @return L'évaluation correspondante sous forme de DTO, ou null si non trouvée.
     */
    public EvaluationDto getEvaluationById(Long id) {
        Optional<Evaluations> evaluationOptional = evaluationRepository.findById(id);
        return evaluationOptional.map(this::convertToDto).orElse(null);
    }

    /**
     * Met à jour une évaluation existante.
     *
     * @param id             L'identifiant de l'évaluation à mettre à jour.
     * @param evaluationDto  Les nouvelles données de l'évaluation.
     * @return L'évaluation mise à jour sous forme de DTO, ou null si non trouvée.
     */
    public EvaluationDto updateEvaluation(Long id, EvaluationDto evaluationDto) {
        Optional<Evaluations> evaluationOptional = evaluationRepository.findById(id);
        if (evaluationOptional.isPresent()) {
            Evaluations evaluation = evaluationOptional.get();
            evaluation.setNote(evaluationDto.getNote());
            evaluation.setCommentaire(evaluationDto.getCommentaire());
            evaluation.setDateEvaluation(evaluationDto.getDateEvaluation());
            Evaluations updatedEvaluation = evaluationRepository.save(evaluation);
            return convertToDto(updatedEvaluation);
        }
        return null;
    }

    /**
     * Supprime une évaluation par son identifiant.
     *
     * @param id L'identifiant de l'évaluation à supprimer.
     * @return true si l'évaluation a été supprimée, false sinon.
     */
    public boolean deleteEvaluation(Long id) {
        if (evaluationRepository.existsById(id)) {
            evaluationRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Convertit un DTO en entité.
     *
     * @param evaluationDto Le DTO à convertir.
     * @return L'entité correspondante.
     */
    private Evaluations convertToEntity(EvaluationDto evaluationDto) {
        Evaluations evaluation = new Evaluations();
        evaluation.setId(evaluationDto.getId());
        evaluation.setNote(evaluationDto.getNote());
        evaluation.setCommentaire(evaluationDto.getCommentaire());
        evaluation.setDateEvaluation(evaluationDto.getDateEvaluation());
        return evaluation;
    }

    /**
     * Convertit une entité en DTO.
     *
     * @param evaluation L'entité à convertir.
     * @return Le DTO correspondant.
     */
    private EvaluationDto convertToDto(Evaluations evaluation) {
        EvaluationDto evaluationDto = new EvaluationDto();
        evaluationDto.setId(evaluation.getId());
        evaluationDto.setNote(evaluation.getNote());
        evaluationDto.setCommentaire(evaluation.getCommentaire());
        evaluationDto.setDateEvaluation(evaluation.getDateEvaluation());
        // Assurez-vous d'ajouter l'ID du livre et de l'utilisateur ici si nécessaire
        if (evaluation.getBook() != null) {
            evaluationDto.setBookId(evaluation.getBook().getId());
        }
        if (evaluation.getUser() != null) {
            evaluationDto.setUserId(evaluation.getUser().getId());
        }
        return evaluationDto;
    }
}
