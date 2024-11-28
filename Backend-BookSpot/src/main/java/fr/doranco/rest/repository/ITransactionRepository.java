package fr.doranco.rest.repository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import fr.doranco.rest.entities.Book;
import fr.doranco.rest.entities.Transaction;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;

public interface ITransactionRepository extends JpaRepository<Transaction, Integer> {
	 @EntityGraph(attributePaths = {"book"})
	    Optional<Transaction> findById(Integer id);
	 
	 @Query("SELECT t FROM Transaction t LEFT JOIN FETCH t.books WHERE t.id = :id")
	 Optional<Transaction> findByIdWithBooks(@Param("id") Integer id);
	 
	


}
