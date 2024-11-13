package fr.doranco.rest.repository;

import java.util.List;

import org.hibernate.query.NativeQuery;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import fr.doranco.rest.entities.Book;
import jakarta.persistence.NamedQuery;

/**
 * Avec Spring, nous pouvons utiliser les méthodes implicites (déjà implémentées) de JpaRepository :
 * save(), findOne(), findById(), findAll(), count(), delete(), deleteById(), findAll(), ...
 * sans avoir besoin à implémenter ces méthodes.
 * L'implémentation de ces méthodes est automatiquement intégrée dans Sprinf-Data-JPA.
 * 
 * Nous définissons également des méthodes de recherche personnalisées sans avoir
 *  à les implémenter :
 *    - findByTitle();
 *    - findByPublished();
 *    - findByTitleContaining();    
 *    - findByDescriptionContaining();    
 *    - findByTitleAndPublished();
 *    - findByIdGreaterThan();
 * 
 * Nous définissons également des méthodes de recherche personnalisées mais
 * il faudra les implémenter nous-même
 * (pour cela, on doit utiliser l'nnotation @Query) :
 *  
 *  Pour plus de détails, consultez le site web de spring :
 *  https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html
 *  
 * @author Ryadh
 *
 */

public interface IBookRepository extends JpaRepository<Book, Long> {

	 List<Book> findByTitle(String title);
	 List<Book> findByPublished(boolean published);
	 List<Book> findByTitleContaining(String text);
	 List<Book> findByDescriptionContaining(String text);
	 List<Book> findByTitleAndPublished(String title, boolean published);
	 List<Book> findByIdGreaterThan(long id);



	 // 1) Requête prédéfinie (Named Query) => il faut définir cette requête dans la classe Book 
//	 @Query(name = "book::findAllBooks")
//	 List<Book> findBooksByTitleAndDescription(String keyword);
	 
	 // 2) Requête native (Native Query)
//	 @Query(value = "SELECT * FROM livre WHERE titre like CONCAT('%',?1,'%') OR description like CONCAT('%',?1,'%')", nativeQuery = true)
//	 List<Book> findBooksByTitleAndDescription(String keyword);
	 
	 // 3) Requête JPQL
	 @Query(value = "SELECT b FROM Book b WHERE b.title like concat('%',?1,'%') OR b.description like concat('%',?1,'%')")
	 List<Book> findBooksByTitleAndDescription(String keyword);
	 
	 @Query(value = "SELECT b FROM Book b WHERE b.title like CONCAT('%',?1,'%')")
	 List<Book> findBooksByTitle(String keyword, Sort sort);
//	 appeler cette méthode depuis le service => repo.findBooksByTitle("java", Sort.by("title"));
	 
	 
	 @Query("SELECT b FROM Book b LEFT JOIN FETCH b.user WHERE b.id IN :bookIds")
	 List<Book> findBooksWithUsers(@Param("bookIds") List<Long> bookIds);


}
