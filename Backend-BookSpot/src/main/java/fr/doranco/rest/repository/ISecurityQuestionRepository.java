package fr.doranco.rest.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import fr.doranco.rest.entities.SecurityQuestions;

public interface ISecurityQuestionRepository extends JpaRepository<SecurityQuestions, Integer> {
}


