package fr.doranco.rest.repository;

import fr.doranco.rest.entities.TransactionTypes;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

public interface ITransactionTypeRepository extends CrudRepository<TransactionTypes, Integer> {

    
	 Optional<TransactionTypes> findByTypeTransaction(String typeTransaction);
    @Override
    List<TransactionTypes> findAll();
    Optional<TransactionTypes> findById(Integer id);
}
