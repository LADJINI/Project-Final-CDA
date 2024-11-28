package fr.doranco.rest.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import fr.doranco.rest.entities.Evaluations;

import java.util.List;

public interface IEvaluationRepository extends JpaRepository<Evaluations, Long> {
    List<Evaluations> findByBookId(Long bookId);
    List<Evaluations> findByUserId(Long userId);
}
