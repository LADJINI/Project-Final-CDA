package fr.doranco.rest.repository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import fr.doranco.rest.entities.Book;
import fr.doranco.rest.entities.Transaction;
import fr.doranco.rest.entities.TransactionTypes;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;

public interface ITransactionRepository extends JpaRepository<Transaction, Integer> {
	 @EntityGraph(attributePaths = {"book"})
	    Optional<Transaction> findById(Integer id);
	 
	 @Query("SELECT t FROM Transaction t LEFT JOIN FETCH t.books WHERE t.id = :id")
	 Optional<Transaction> findByIdWithBooks(@Param("id") Integer id);
	 
	 @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId")
	 List<Transaction> findByUserId(@Param("userId") Long userId);
	 
	 List<Transaction> findByTypeTransaction(TransactionTypes  typeTransaction);


}
