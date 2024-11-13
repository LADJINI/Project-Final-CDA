package fr.doranco.rest.services;

import fr.doranco.rest.dto.RegisterRequest;
import fr.doranco.rest.dto.UserDto;
import fr.doranco.rest.entities.ERole;
import fr.doranco.rest.entities.Role;
import fr.doranco.rest.entities.User;
import fr.doranco.rest.exception.EmailAlreadyExistsException;
import fr.doranco.rest.exception.ResourceNotFoundException;
import fr.doranco.rest.repository.IRoleRepository;
import fr.doranco.rest.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service pour la gestion des utilisateurs.
 * Fournit des méthodes pour créer, récupérer, mettre à jour et supprimer des utilisateurs.
 */
@Service
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final IUserRepository userRepository;
    private final IRoleRepository roleRepository;

    /**
     * Constructeur avec injection des dépendances.
     * @param passwordEncoder L'encodeur de mot de passe pour sécuriser les mots de passe des utilisateurs.
     * @param userRepository Repository pour l'accès aux données des utilisateurs.
     * @param roleRepository Repository pour l'accès aux données des rôles.
     */
    @Autowired
    public UserService(PasswordEncoder passwordEncoder, IUserRepository userRepository, IRoleRepository roleRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    /**
     * Trouve un utilisateur par son email.
     * @param email L'email de l'utilisateur à rechercher.
     * @return Un Optional contenant le DTO de l'utilisateur s'il est trouvé.
     */
    @Transactional(readOnly = true)
    public Optional<UserDto> findByEmail(String email) {
        return userRepository.findByEmail(email).map(this::convertToDto);
    }
    
   

    /**
     * Récupère tous les utilisateurs.
     * @return Une liste de DTOs représentant tous les utilisateurs.
     */
    @Transactional(readOnly = true)
    public List<UserDto> findAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Trouve un utilisateur par son ID.
     * @param id L'ID de l'utilisateur à rechercher.
     * @return Un Optional contenant le DTO de l'utilisateur s'il est trouvé.
     */
    @Transactional(readOnly = true)
    public Optional<UserDto> findById(Long id) {
        return userRepository.findById(id).map(this::convertToDto);
    }

    /**
     * Crée un nouvel utilisateur.
     * @param userDto Les données de l'utilisateur à créer.
     * @return Le DTO de l'utilisateur créé.
     * @throws EmailAlreadyExistsException Si l'email est déjà utilisé.
     */
    @Transactional
    public UserDto createUser(UserDto userDto) throws EmailAlreadyExistsException {
        if (userRepository.findByEmail(userDto.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("L'email existe déjà.");
        }

        // Récupération du rôle, sinon on assigne le rôle par défaut (ROLE_USER)
        Role role = (userDto.getRoleId() != null) ?
                roleRepository.findById(userDto.getRoleId())
                        .orElseThrow(() -> new RuntimeException("Rôle non trouvé pour l'ID : " + userDto.getRoleId())) :
                roleRepository.findByName(ERole.ROLE_USER)
                        .orElseThrow(() -> new RuntimeException("Rôle utilisateur par défaut non trouvé."));

        User user = new User();
        user.setEmail(userDto.getEmail());
        user.setNom(userDto.getNom());
        user.setPrenom(userDto.getPrenom());
        user.setDateNaissance(userDto.getDateNaissance());
        user.setAddress(userDto.getAddress());
        user.setTelephone(userDto.getTelephone());
        user.setSexe(userDto.getSexe());  // Ajout du champ sexe
        user.setActif(userDto.getActif() != null ? userDto.getActif() : false);  // Initialisation du champ actif
        user.setRegistrationDate(LocalDate.now());  // Initialisation de la date d'inscription
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));  // Encodage du mot de passe
        user.setRole(role);  // Association du rôle

        userRepository.save(user);
        return convertToDto(user);
    }

    /**
     * Met à jour un utilisateur en fonction de son email.
     * 
     * @param email L'email de l'utilisateur à mettre à jour.
     * @param userDto Les nouvelles données de l'utilisateur.
     * @return Le DTO de l'utilisateur mis à jour.
     * @throws ResourceNotFoundException Si l'utilisateur n'est pas trouvé pour l'email fourni.
     */
    @Transactional
    public UserDto updateUserByEmail(String email, UserDto userDto) throws ResourceNotFoundException {
        // Recherche l'utilisateur par email
        User existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé pour l'email : " + email));

        // Mise à jour des informations de l'utilisateur
        existingUser.setNom(userDto.getNom());
        existingUser.setPrenom(userDto.getPrenom());
        existingUser.setDateNaissance(userDto.getDateNaissance());
        existingUser.setAddress(userDto.getAddress());
        existingUser.setTelephone(userDto.getTelephone());
        existingUser.setSexe(userDto.getSexe());  // Ajout du champ sexe

        // Si le champ actif est fourni, mettez à jour la valeur
        if (userDto.getActif() != null) {
            existingUser.setActif(userDto.getActif());
        }

        // Mise à jour du mot de passe si un nouveau mot de passe est fourni
        if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(userDto.getPassword()));  // Encodage du mot de passe
        }

        // Mise à jour du rôle si l'ID du rôle est fourni
        if (userDto.getRoleId() != null) {
            Role role = roleRepository.findById(userDto.getRoleId())
                    .orElseThrow(() -> new RuntimeException("Rôle non trouvé pour l'ID : " + userDto.getRoleId()));
            existingUser.setRole(role);
        }

        // Sauvegarde l'utilisateur mis à jour dans la base de données
        userRepository.save(existingUser);

        // Retourne le DTO de l'utilisateur mis à jour
        return convertToDto(existingUser);
    }

    /**
     * Met à jour un utilisateur existant.
     * @param id L'ID de l'utilisateur à mettre à jour.
     * @param userDto Les nouvelles données de l'utilisateur.
     * @return Le DTO de l'utilisateur mis à jour.
     * @throws ResourceNotFoundException Si l'utilisateur n'est pas trouvé.
     */
    @Transactional
    public UserDto updateUser(Long id, UserDto userDto) throws ResourceNotFoundException {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé pour l'ID : " + id));

        existingUser.setNom(userDto.getNom());
        existingUser.setPrenom(userDto.getPrenom());
        existingUser.setDateNaissance(userDto.getDateNaissance());
        existingUser.setAddress(userDto.getAddress());
        existingUser.setTelephone(userDto.getTelephone());
        existingUser.setSexe(userDto.getSexe());  // Ajout du champ sexe

        // Si le champ actif est fourni, mettez à jour la valeur
        if (userDto.getActif() != null) {
            existingUser.setActif(userDto.getActif());
        }

        if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(userDto.getPassword()));  // Encodage du mot de passe s'il est modifié
        }

        // Mise à jour du rôle si l'ID du rôle est fourni
        if (userDto.getRoleId() != null) {
            Role role = roleRepository.findById(userDto.getRoleId())
                    .orElseThrow(() -> new RuntimeException("Rôle non trouvé pour l'ID : " + userDto.getRoleId()));
            existingUser.setRole(role);
        }

        userRepository.save(existingUser);
        return convertToDto(existingUser);
    }


    /**
     * Récupère une liste de DTOs d'utilisateurs ayant un rôle spécifique.
     * Cette méthode est en lecture seule grâce à l'annotation {@code @Transactional(readOnly = true)} 
     * pour améliorer les performances lors des opérations de lecture.
     *
     * @param roleId L'identifiant du rôle dont les utilisateurs doivent être récupérés.
     * @return Une liste d'objets {@code UserDto} représentant les utilisateurs ayant le rôle spécifié.
     * @throws RuntimeException Si le rôle avec l'ID spécifié n'est pas trouvé dans la base de données.
     */
    @Transactional(readOnly = true)
    public List<UserDto> findUserDtosByRoleId(Long roleId) {
        
        // Récupère le rôle correspondant à l'ID fourni, ou lance une exception si aucun rôle n'est trouvé
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Rôle non trouvé pour l'ID : " + roleId));

        // Récupère les utilisateurs ayant ce rôle, les convertit en DTO et retourne une liste de DTOs
        return userRepository.findByRole(role).stream()
                .map(this::convertToDto)  // Convertit chaque utilisateur en DTO
                .collect(Collectors.toList());  // Collecte les résultats dans une liste
    }

    /**
     * Supprime un utilisateur.
     * @param id L'ID de l'utilisateur à supprimer.
     * @throws ResourceNotFoundException Si l'utilisateur n'est pas trouvé.
     */
    @Transactional
    public void deleteUser(Long id) throws ResourceNotFoundException {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("Utilisateur non trouvé pour l'ID : " + id);
        }
        userRepository.deleteById(id);
    }

    /**
     * Convertit une entité User en DTO UserDto.
     * @param user L'utilisateur à convertir.
     * @return Le DTO de l'utilisateur.
     */
    private UserDto convertToDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setEmail(user.getEmail());
        userDto.setNom(user.getNom());
        userDto.setPrenom(user.getPrenom());
        userDto.setDateNaissance(user.getDateNaissance());
        userDto.setAddress(user.getAddress());
        userDto.setTelephone(user.getTelephone());
        userDto.setSexe(user.getSexe());  // Ajout du champ sexe
        userDto.setActif(user.getActif());  // Ajout du champ actif
        userDto.setRegistrationDate(user.getRegistrationDate());  // Ajout du champ registrationDate
        userDto.setRoleId(user.getRole() != null ? user.getRole().getId() : null);  // Récupère le rôle associé
        return userDto;
    }

    /**
     * Crée un nouvel utilisateur lors de l'enregistrement.
     * @param registerRequest Les données d'enregistrement fournies.
     * @return Le DTO de l'utilisateur enregistré.
     */
    public UserDto register(RegisterRequest registerRequest) {
        UserDto userDto = new UserDto();
        userDto.setEmail(registerRequest.getEmail());
        userDto.setNom(registerRequest.getNom());
        userDto.setPrenom(registerRequest.getPrenom());
        userDto.setPassword(registerRequest.getPassword());
        userDto.setSexe(registerRequest.getSexe());  
        userDto.setAddress(registerRequest.getAddress());  
        userDto.setTelephone(registerRequest.getTelephone());  
        userDto.setDateNaissance(registerRequest.getDateNaissance());  
        return createUser(userDto);
    }
    public User convertToEntity(UserDto userDto) {
        User user = new User();
        user.setId(userDto.getId());
        user.setEmail(userDto.getEmail());
        user.setNom(userDto.getNom());
        user.setPrenom(userDto.getPrenom());
        user.setDateNaissance(userDto.getDateNaissance());
        user.setAddress(userDto.getAddress());
        user.setTelephone(userDto.getTelephone());
        user.setSexe(userDto.getSexe());
        user.setActif(userDto.getActif());
        user.setRegistrationDate(userDto.getRegistrationDate());
        return user;
    }

}
