package fr.doranco.rest.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import fr.doranco.rest.entities.TransactionType;

public interface ITransactionTypeRepository extends JpaRepository<TransactionType, Integer> {
}
