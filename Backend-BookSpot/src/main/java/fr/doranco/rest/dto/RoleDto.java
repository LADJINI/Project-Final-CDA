package fr.doranco.rest.dto;

import fr.doranco.rest.entities.ERole;

/**
 * DTO pour les rôles.
 */
public class RoleDto {

    private Long id;  // Utiliser Long au lieu de Integer
    private ERole name;  // Utiliser ERole au lieu de String

    // Getters et Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ERole getName() {
        return name;
    }

    public void setName(ERole name) {
        this.name = name;
    }
}
