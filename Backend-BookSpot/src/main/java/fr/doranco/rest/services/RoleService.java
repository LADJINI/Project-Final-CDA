package fr.doranco.rest.services;

import fr.doranco.rest.dto.RoleDto;
import fr.doranco.rest.entities.ERole;
import fr.doranco.rest.entities.Role;
import fr.doranco.rest.repository.IRoleRepository;
import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service pour la gestion des rôles.
 * Cette classe contient la logique métier pour les opérations sur les rôles.
 */
@Service
public class RoleService {

    @Autowired
    private IRoleRepository roleRepository;
    
    /**
     * Initialise les rôles de base (ROLE_USER et ROLE_ADMIN) si ceux-ci
     * n'existent pas encore dans la base de données.
     */
    @PostConstruct
    public void initializeRoles() {
        for (ERole eRole : ERole.values()) {
            if (!roleRepository.findByName(eRole).isPresent()) {
                Role role = new Role();
                role.setName(eRole);
                roleRepository.save(role);
            }
        }
    }

    /**
     * Récupère tous les rôles.
     *
     * @return Une liste de RoleDto représentant tous les rôles
     */
    public List<RoleDto> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Récupère un rôle par son ID.
     *
     * @param id L'ID du rôle à récupérer
     * @return Le RoleDto correspondant, ou null si non trouvé
     */
    public Optional<RoleDto> findById(Long id) {
        return roleRepository.findById(id)
                .map(this::convertToDto);
    }

    /**
     * Crée un nouveau rôle.
     *
     * @param roleDto Les données du rôle à créer
     * @return Le RoleDto du rôle créé
     */
    public RoleDto createRole(RoleDto roleDto) {
        Role role = convertToEntity(roleDto);
        Role savedRole = roleRepository.save(role);
        return convertToDto(savedRole);
    }

    /**
     * Met à jour un rôle existant.
     *
     * @param id L'ID du rôle à mettre à jour
     * @param roleDto Les nouvelles données du rôle
     * @return Le RoleDto du rôle mis à jour, ou null si le rôle n'existe pas
     */
    public RoleDto updateRole(Long id, RoleDto roleDto) {
        if (roleRepository.existsById(id)) {
            Role role = convertToEntity(roleDto);
            role.setId(id);
            Role updatedRole = roleRepository.save(role);
            return convertToDto(updatedRole);
        }
        return null;
    }

    /**
     * Supprime un rôle par son ID.
     *
     * @param id L'ID du rôle à supprimer
     * @return true si le rôle a été supprimé, false sinon
     */
    public boolean deleteRole(Long id) {
        if (roleRepository.existsById(id)) {
            roleRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Récupère un rôle par son nom.
     *
     * @param name Le nom du rôle (de type ERole)
     * @return Le RoleDto correspondant, ou null si non trouvé
     */
    public RoleDto getRoleByName(ERole name) {
        return roleRepository.findByName(name)
                .map(this::convertToDto)
                .orElse(null);
    }

    /**
     * Convertit une entité Role en RoleDto.
     *
     * @param role L'entité Role à convertir
     * @return Le RoleDto correspondant
     */
    private RoleDto convertToDto(Role role) {
        RoleDto dto = new RoleDto();
        dto.setId(role.getId());
        dto.setName(role.getName());
        return dto;
    }

    /**
     * Convertit un RoleDto en entité Role.
     *
     * @param dto Le RoleDto à convertir
     * @return L'entité Role correspondante
     */
    private Role convertToEntity(RoleDto dto) {
        Role role = new Role();
        role.setId(dto.getId());
        role.setName(dto.getName());
        return role;
    }
}