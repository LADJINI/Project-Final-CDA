package fr.doranco.rest.repository;



import org.springframework.data.jpa.repository.JpaRepository;

import fr.doranco.rest.entities.Transaction;

public interface ITransactionRepository extends JpaRepository<Transaction, Integer> {
}
