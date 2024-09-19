package fr.doranco.rest.controllers;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import fr.doranco.rest.dto.JwtResponse;
import fr.doranco.rest.dto.LoginRequest;
import fr.doranco.rest.dto.RegisterRequest;
import fr.doranco.rest.dto.UserDto;
import fr.doranco.rest.exception.EmailAlreadyExistsException;
import fr.doranco.rest.security.JwtUtils;
import fr.doranco.rest.security.UserDetailsImpl;
import fr.doranco.rest.services.UserService;

/**
 * Contrôleur gérant l'authentification et l'enregistrement des utilisateurs.
 * Ce contrôleur fournit des points d'accès pour la connexion et l'inscription.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtils jwtUtils;

     
    /**
     * Gère l'enregistrement de nouveaux utilisateurs.
     * Cette méthode crée un nouvel utilisateur avec le rôle par défaut ou un rôle spécifique si fourni.
     * @param registerRequest Requête d'enregistrement contenant les informations de l'utilisateur.
     * @return ResponseEntity contenant un message de succès ou d'erreur.
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            // Conversion de la requête en UserDto pour passer au service utilisateur
            UserDto userDto = convertToUserDto(registerRequest);

            // Création de l'utilisateur via le service
            UserDto createdUser = userService.createUser(userDto);

            logger.info("Nouvel utilisateur enregistré : {}", createdUser.getEmail());

            // Réponse HTTP avec un statut 201 (Created)
            return ResponseEntity.status(HttpStatus.CREATED).body("Utilisateur enregistré avec succès");
        } catch (EmailAlreadyExistsException e) {
            // Gestion de l'exception en cas d'email déjà utilisé
            logger.warn("Tentative d'enregistrement avec un email existant : {}", registerRequest.getEmail());
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Cet email est déjà utilisé");
        } catch (Exception e) {
            // Gestion des autres erreurs éventuelles
            logger.error("Erreur lors de l'enregistrement de l'utilisateur", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Une erreur est survenue lors de l'enregistrement");
        }
    }

    /**
     * Convertit une requête d'enregistrement en un objet UserDto.
     * Ce DTO est ensuite utilisé pour créer un utilisateur dans la base de données.
     * @param registerRequest Les informations de l'utilisateur à enregistrer.
     * @return Un UserDto prêt à être utilisé pour la création de l'utilisateur.
     */
    private UserDto convertToUserDto(RegisterRequest registerRequest) {
        UserDto userDto = new UserDto();
        
        // Mapping des informations personnelles
        userDto.setEmail(registerRequest.getEmail());
        userDto.setPassword(registerRequest.getPassword());
        userDto.setNom(registerRequest.getNom());
        userDto.setPrenom(registerRequest.getPrenom());
        userDto.setDateNaissance(registerRequest.getDateNaissance());
        userDto.setSexe(registerRequest.getSexe());
        userDto.setTelephone(registerRequest.getTelephone());
        userDto.setAddress(registerRequest.getAddress());  
        userDto.setRegistrationDate(LocalDate.now());      
        userDto.setActif(true);                           

        // Récupération du rôle si spécifié (sinon, on peut définir un rôle par défaut dans le service)
        userDto.setRoleId(registerRequest.getRoleId() != null ? registerRequest.getRoleId().longValue() : null);
   //Cela convertira l'Integer en Long si une valeur est présente. Si roleId est null, on passera simplement null.

        return userDto;
    }

    
    /**
     * Gère la connexion des utilisateurs.
     * @param loginRequest Requête de connexion contenant l'email et le mot de passe.
     * @return ResponseEntity contenant le token JWT et les informations de l'utilisateur en cas de succès,
     *         ou un message d'erreur en cas d'échec.
     */
    
    
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        if (loginRequest.getEmail() == null || loginRequest.getEmail().isEmpty()) {
            logger.error("Tentative de connexion avec un email null ou vide");
            return ResponseEntity.badRequest().body("L'email ne peut pas être vide");
        }

        if (loginRequest.getPassword() == null || loginRequest.getPassword().isEmpty()) {
            logger.error("Tentative de connexion avec un mot de passe null ou vide pour l'email : {}", loginRequest.getEmail());
            return ResponseEntity.badRequest().body("Le mot de passe ne peut pas être vide");
        }

        logger.info("Tentative de connexion pour l'utilisateur : {}", loginRequest.getEmail());

        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            String jwt = jwtUtils.generateJwtToken(userDetails);

            List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

            logger.info("Connexion réussie pour l'utilisateur : {}", loginRequest.getEmail());

            return ResponseEntity.ok(new JwtResponse(jwt, 
                                 userDetails.getId(), 
                                 userDetails.getEmail(), // Utiliser l'email comme identifiant principal
                                 roles));
        } catch (AuthenticationException e) {
            logger.error("Échec de l'authentification pour l'utilisateur : {}", loginRequest.getEmail(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentification échouée : identifiants incorrects");
        }
    }

    }


