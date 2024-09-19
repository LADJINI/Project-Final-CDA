package fr.doranco.rest.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import fr.doranco.rest.entities.Evaluation;

import java.util.List;

public interface IEvaluationRepository extends JpaRepository<Evaluation, Long> {
    List<Evaluation> findByBookId(Long bookId);
    List<Evaluation> findByUserId(Long userId);
}
