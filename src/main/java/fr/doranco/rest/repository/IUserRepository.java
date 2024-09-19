package fr.doranco.rest.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import fr.doranco.rest.entities.Role;
import fr.doranco.rest.entities.User;

/**
 * Nous pouvons utiliser les méthodes implicites de JpaRepository :
 * save(), findOne(), findById(), findAll(), count(), delete(), deleteById(), ...
 * sans avoir besoin d'implémenter ces méthodes.
 * L'implémentation de ces méthodes est automatiquement intégrée dans Spring-Data-JPA.
 * 
 * Nous définissons également des méthodes de recherche personnalisées sans avoir
 * à les implémenter :
 *    - findAll();
 *    - findByNom();
 *    - findByPrenom();
 *    - findByEmail();
 *    - findByNomContainingOrPrenomContaining();
 * 
 * Nous définissons également des méthodes de recherche personnalisées mais
 * il faudra les implémenter nous-même
 * (pour cela, on doit utiliser l'annotation @Query) :
 *  
 *  Pour plus de détails, consultez le site web de Spring :
 *  https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html
 *  
 */

public interface IUserRepository extends JpaRepository<User, Long> {
    List<User> findByNom(String nom);
    List<User> findByPrenom(String prenom);
    List<User> findByNomContainingOrPrenomContaining(String nom, String prenom);
    List<User> findByIdGreaterThan(long id);
    List<User> findByRoleId(Long roleId);
    Optional<User> findByEmail(String email);

    // 3) Requête JPQL
    @Query(value = "SELECT u FROM User u WHERE u.nom like %?1% OR u.prenom like %?1%")
    List<User> findUsersByNomOrPrenom(String keyword);

    //@Query(value = "SELECT u FROM User u WHERE u.email = ?1")
    //Optional<User> findUserByEmail(String email);

    @Query(value = "SELECT u FROM User u WHERE u.nom like %?1%")
    List<User> findUsersByNom(String keyword, Sort sort);
    // appeler cette méthode depuis le service => repo.findUsersByNom("Dupont", Sort.by("nom"));
    
    @Query("SELECT u FROM User u JOIN FETCH u.role WHERE u.email = :email")
    Optional<User> findByEmailWithRole(@Param("email") String email);
      
        List<User> findByRole(Role role);
   
}

