package fr.doranco.rest.repository;

import fr.doranco.rest.entities.TransactionType;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

public interface ITransactionTypeRepository extends CrudRepository<TransactionType, Integer> {

    
	 Optional<TransactionType> findByTypeTransaction(String typeTransaction);
    @Override
    List<TransactionType> findAll();
    Optional<TransactionType> findById(Integer id);
}
