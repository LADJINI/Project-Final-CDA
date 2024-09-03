package fr.doranco.rest.controllers;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import fr.doranco.rest.dto.RoleDto;
import fr.doranco.rest.dto.UserDto;
import fr.doranco.rest.exception.EmailAlreadyExistsException;
import fr.doranco.rest.services.RoleService;
import fr.doranco.rest.services.UserService;

@CrossOrigin(origins = "http://localhost:8086")
@RestController
@RequestMapping("/api")
public class UserController {
    
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Enregistre un nouvel utilisateur.
     * @param userDto Les données de l'utilisateur à enregistrer.
     * @return ResponseEntity contenant l'utilisateur enregistré ou une erreur.
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDto userDto) {
        try {
            if (userDto.getPassword() == null || userDto.getPassword().isEmpty()) {
                return ResponseEntity.badRequest().body("Le mot de passe ne peut pas être vide");
            }
            userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));
            userDto.setRegistrationDate(LocalDate.now());
            userDto.setActif(false);

            UserDto savedUserDto = userService.createUser(userDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUserDto);
        } catch (EmailAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Cet email est déjà utilisé");
        } catch (Exception e) {
            logger.error("Erreur lors de l'enregistrement de l'utilisateur", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Une erreur est survenue lors de l'enregistrement");
        }
    }

    /**
     * Récupère tous les utilisateurs.
     * @return ResponseEntity contenant la liste des utilisateurs.
     */
    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userService.findAllUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * Ajoute un nouvel utilisateur.
     * @param userDto Les données de l'utilisateur à ajouter.
     * @return ResponseEntity contenant l'utilisateur ajouté ou une erreur.
     */
    @PostMapping("/addUser")
    public ResponseEntity<?> addUser(@RequestBody UserDto userDto) {
        try {
            if (!isValidUserDto(userDto)) {
                return ResponseEntity.badRequest().body("Tous les champs obligatoires doivent être renseignés");
            }
            if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()) {
                userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));
            } else {
                return ResponseEntity.badRequest().body("Le mot de passe est obligatoire");
            }
            if (userDto.getRegistrationDate() == null) {
                userDto.setRegistrationDate(LocalDate.now());
            }
            Optional<RoleDto> roleOptional = roleService.findById(userDto.getRoleId());
            if (roleOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("Le rôle spécifié n'existe pas");
            }
            UserDto savedUserDto = userService.createUser(userDto);
            logger.info("Nouvel utilisateur créé avec l'ID : {} et le rôle : {}", savedUserDto.getId(), savedUserDto.getRoleId());
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUserDto);
        } catch (EmailAlreadyExistsException e) {
            logger.error("Tentative de création d'un utilisateur avec un email existant : {}", userDto.getEmail());
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Cet email est déjà utilisé");
        } catch (Exception e) {
            logger.error("Erreur lors de la création de l'utilisateur", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Une erreur est survenue lors de la création de l'utilisateur");
        }
    }

    /**
     * Récupère les utilisateurs par rôle.
     * @param roleId L'ID du rôle.
     * @return ResponseEntity contenant la liste des utilisateurs pour le rôle donné.
     */
    @GetMapping("/roles/{roleId}/users")
    public ResponseEntity<List<UserDto>> getUsersByRole(@PathVariable Integer roleId) {
        Optional<RoleDto> roleOptional = roleService.findById(roleId);
        if (roleOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        List<UserDto> userDtos = userService.findUserDtosByRoleId(roleId);
        return ResponseEntity.ok(userDtos);
    }

    /**
     * Récupère un utilisateur par son ID.
     * @param id L'ID de l'utilisateur.
     * @return ResponseEntity contenant l'utilisateur ou une erreur.
     */
    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable("id") long id) {
        try {
            return userService.findById(id)
                .map(userDto -> ResponseEntity.ok(userDto))
                .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération de l'utilisateur avec l'ID : " + id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Une erreur est survenue lors de la récupération de l'utilisateur");
        }
    }

    /**
     * Met à jour un utilisateur.
     * @param id L'ID de l'utilisateur à mettre à jour.
     * @param userDto Les nouvelles données de l'utilisateur.
     * @return ResponseEntity contenant l'utilisateur mis à jour ou une erreur.
     */
    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable("id") Long id, @RequestBody UserDto userDto) {
        try {
            if (userDto == null) {
                return ResponseEntity.badRequest().body("L'utilisateur à mettre à jour ne peut pas être null");
            }
            UserDto updatedUser = userService.updateUser(id, userDto);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            logger.error("Erreur lors de la mise à jour de l'utilisateur", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Une erreur est survenue lors de la mise à jour de l'utilisateur");
        }
    }

    /**
     * Supprime un utilisateur.
     * @param id L'ID de l'utilisateur à supprimer.
     * @return ResponseEntity contenant un message de confirmation ou une erreur.
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> removeUser(@PathVariable("id") long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("Utilisateur supprimé avec succès");
        } catch (Exception e) {
            logger.error("Erreur lors de la suppression de l'utilisateur", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Une erreur est survenue lors de la suppression");
        }
    }

    /**
     * Récupère un utilisateur par son email.
     * @param email L'email de l'utilisateur.
     * @return ResponseEntity contenant l'utilisateur ou une erreur.
     */
    @GetMapping("/users/email/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable("email") String email) {
        try {
            return userService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération de l'utilisateur par email", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Une erreur est survenue");
        }
    }

    /**
     * Vérifie si un UserDto est valide.
     * @param userDto Le UserDto à vérifier.
     * @return true si le UserDto est valide, false sinon.
     */
    private boolean isValidUserDto(UserDto userDto) {
        return userDto != null &&
               userDto.getNom() != null && !userDto.getNom().trim().isEmpty() &&
               userDto.getPrenom() != null && !userDto.getPrenom().trim().isEmpty() &&
               userDto.getEmail() != null && !userDto.getEmail().trim().isEmpty() &&
               userDto.getDateNaissance() != null &&
               userDto.getTelephone() != null && !userDto.getTelephone().trim().isEmpty() &&
               userDto.getRoleId() != null;
    }
}