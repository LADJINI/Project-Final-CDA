package fr.doranco.rest.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import fr.doranco.rest.entities.SecurityQuestion;

public interface ISecurityQuestionRepository extends JpaRepository<SecurityQuestion, Integer> {
}


