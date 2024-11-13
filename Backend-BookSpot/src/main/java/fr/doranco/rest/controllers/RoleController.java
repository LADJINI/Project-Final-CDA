package fr.doranco.rest.controllers;

import fr.doranco.rest.dto.RoleDto;
import fr.doranco.rest.entities.ERole;
import fr.doranco.rest.services.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Contrôleur REST pour la gestion des rôles.
 * Ce contrôleur fournit des endpoints pour effectuer des opérations CRUD sur les rôles.
 */
@RestController
@RequestMapping("/api/roles")
public class RoleController {

    @Autowired
    private RoleService roleService;

    /**
     * Récupère tous les rôles.
     *
     * @return ResponseEntity contenant une liste de RoleDto et le statut HTTP OK
     */
    @GetMapping
    public ResponseEntity<List<RoleDto>> getAllRoles() {
        List<RoleDto> roles = roleService.getAllRoles();
        return new ResponseEntity<>(roles, HttpStatus.OK);
    }

    /**
     * Récupère un rôle par son ID.
     *
     * @param id L'ID du rôle à récupérer
     * @return ResponseEntity contenant le RoleDto si trouvé, sinon retourne un statut NOT_FOUND
     */
    @GetMapping("/{id}")
    public ResponseEntity<RoleDto> getRoleById(@PathVariable Long id) {
        Optional<RoleDto> role = roleService.findById(id);
        return role.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Crée un nouveau rôle.
     *
     * @param roleDto Les données du rôle à créer
     * @return ResponseEntity contenant le RoleDto créé et le statut CREATED
     */
    @PostMapping
    public ResponseEntity<RoleDto> createRole(@RequestBody RoleDto roleDto) {
        RoleDto createdRole = roleService.createRole(roleDto);
        return new ResponseEntity<>(createdRole, HttpStatus.CREATED);
    }

    /**
     * Met à jour un rôle existant.
     *
     * @param id L'ID du rôle à mettre à jour
     * @param roleDto Les nouvelles données du rôle
     * @return ResponseEntity contenant le RoleDto mis à jour si trouvé, sinon retourne un statut NOT_FOUND
     */
    @PutMapping("/{id}")
    public ResponseEntity<RoleDto> updateRole(@PathVariable Long id, @RequestBody RoleDto roleDto) {
        RoleDto updatedRole = roleService.updateRole(id, roleDto);
        return updatedRole != null ? ResponseEntity.ok(updatedRole) : ResponseEntity.notFound().build();
    }

    /**
     * Supprime un rôle par son ID.
     *
     * @param id L'ID du rôle à supprimer
     * @return ResponseEntity avec un statut NO_CONTENT si supprimé, sinon retourne un statut NOT_FOUND
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable Long id) {
        boolean deleted = roleService.deleteRole(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    /**
     * Récupère un rôle par son nom.
     *
     * @param name Le nom du rôle à récupérer (de type ERole)
     * @return ResponseEntity contenant le RoleDto si trouvé, sinon retourne un statut NOT_FOUND
     */
    @GetMapping("/name/{name}")
    public ResponseEntity<RoleDto> getRoleByName(@PathVariable ERole name) {
        RoleDto role = roleService.getRoleByName(name);
        return role != null ? ResponseEntity.ok(role) : ResponseEntity.notFound().build();
    }
}
