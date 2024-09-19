package fr.doranco.rest.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import fr.doranco.rest.dto.RoleDto;
import fr.doranco.rest.entities.Role;
import fr.doranco.rest.repository.IRoleRepository;

/**
 * Service pour la gestion des rôles.
 */
@Service
public class RoleService {

    @Autowired
    private IRoleRepository roleRepository;

    /**
     * Recherche un rôle par son identifiant.
     * 
     * @param id L'identifiant du rôle.
     * @return Un Optional contenant le RoleDto si trouvé.
     */
    @Transactional
    public Optional<RoleDto> findById(Long id) {  // Changer Integer en Long
        return roleRepository.findById(id)
            .map(this::convertToDto);
    }

    /**
     * Convertit un objet Role en un DTO RoleDto.
     * 
     * @param role L'entité Role.
     * @return Un objet RoleDto.
     */
    private RoleDto convertToDto(Role role) {
        RoleDto dto = new RoleDto();
        dto.setId(role.getId());  // Assurez-vous que id est de type Long
        dto.setName(role.getName());  // Assurez-vous que name est de type ERole
        return dto;
    }
}
