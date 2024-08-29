package fr.doranco.rest.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import fr.doranco.rest.entities.Role;

import java.util.Optional;

@Repository
public interface IRoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findById(Integer id);  // Changé de 'findByLabel' à 'findByName'
    Optional<Role> findByName(String name);
}
