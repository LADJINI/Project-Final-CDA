package fr.doranco.rest.services;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fr.doranco.rest.entities.User;
import fr.doranco.rest.dto.RegisterRequest;
import fr.doranco.rest.dto.UserDto;
import fr.doranco.rest.entities.Role;
import fr.doranco.rest.repository.IUserRepository;
import fr.doranco.rest.repository.IRoleRepository;
import fr.doranco.rest.exception.EmailAlreadyExistsException;
import fr.doranco.rest.exception.ResourceNotFoundException;

/**
 * Service pour la gestion des utilisateurs.
 */
@Service
public class UserService {
    private final PasswordEncoder passwordEncoder;
    private final IUserRepository userRepository;
    private final IRoleRepository roleRepository;

    /**
     * Constructeur pour l'injection de dépendances.
     * @param passwordEncoder L'encodeur de mot de passe.
     * @param userRepository Le repository pour les opérations sur les utilisateurs.
     * @param roleRepository Le repository pour les opérations sur les rôles.
     */
    @Autowired
    public UserService(PasswordEncoder passwordEncoder, IUserRepository userRepository, IRoleRepository roleRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    /**
     * Trouve un utilisateur par son email.
     * @param email L'email de l'utilisateur.
     * @return Un Optional contenant l'utilisateur s'il est trouvé.
     */
    @Transactional(readOnly = true)
    public Optional<UserDto> findByEmail(String email) {
        return userRepository.findByEmail(email).map(this::convertToDto);
    }

    /**
     * Trouve tous les utilisateurs.
     * @return Une liste de tous les utilisateurs.
     */
    @Transactional(readOnly = true)
    public List<UserDto> findAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Trouve un utilisateur par son ID.
     * @param id L'ID de l'utilisateur.
     * @return Un Optional contenant l'utilisateur s'il est trouvé.
     */
    @Transactional(readOnly = true)
    public Optional<UserDto> findById(Long id) {
        return userRepository.findById(id).map(this::convertToDto);
    }

    /**
     * Crée un nouvel utilisateur.
     * @param userDto Les données de l'utilisateur à créer.
     * @return L'utilisateur créé.
     * @throws EmailAlreadyExistsException Si l'email existe déjà.
     */
    @Transactional
    public UserDto createUser(UserDto userDto) throws EmailAlreadyExistsException {
        if (userRepository.findByEmail(userDto.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("Email already exists");
        }
        User user = convertToEntity(userDto);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user = userRepository.save(user);
        return convertToDto(user);
    }

    /**
     * Trouve un utilisateur par son email.
     * @param email L'email de l'utilisateur.
     * @return Un Optional contenant l'utilisateur s'il est trouvé.
     */
    @Transactional(readOnly = true)
    public Optional<User> findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Met à jour un utilisateur existant.
     * @param id L'ID de l'utilisateur à mettre à jour.
     * @param userDto Les nouvelles données de l'utilisateur.
     * @return L'utilisateur mis à jour.
     */
    @Transactional
    public UserDto updateUser(Long id, UserDto userDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        updateUserFromDto(user, userDto);
        user = userRepository.save(user);
        return convertToDto(user);
    }

    /**
     * Supprime un utilisateur.
     * @param id L'ID de l'utilisateur à supprimer.
     * @throws ResourceNotFoundException Si l'utilisateur n'est pas trouvé.
     */
    @Transactional
    public void deleteUser(Long id) throws ResourceNotFoundException {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    /**
     * Trouve les utilisateurs par ID de rôle.
     * @param roleId L'ID du rôle.
     * @return Une liste d'utilisateurs ayant le rôle spécifié.
     */
    @Transactional(readOnly = true)
    public List<UserDto> findUsersByRoleId(Integer roleId) {
        return userRepository.findByRoleId(roleId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Enregistre un nouvel utilisateur.
     * @param registerRequest Les données d'enregistrement de l'utilisateur.
     * @return L'utilisateur enregistré.
     * @throws EmailAlreadyExistsException Si l'email existe déjà.
     */
    @Transactional
    public User registerNewUser(RegisterRequest registerRequest) throws EmailAlreadyExistsException {
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("Email already exists");
        }

        User user = new User();
        user.setNom(registerRequest.getNom());
        user.setPrenom(registerRequest.getPrenom());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setSexe(registerRequest.getSexe());
        user.setDateNaissance(registerRequest.getDateNaissance());
        user.setTelephone(registerRequest.getTelephone());
        user.setAddress(registerRequest.getAddress());
        user.setRegistrationDate(LocalDate.now());
        user.setActif(false);

        Role defaultRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("Default role not found"));
        user.setRole(defaultRole);

        return userRepository.save(user);
    }
    @Transactional(readOnly = true)
    public List<UserDto> findUserDtosByRoleId(Integer roleId) {
        List<User> users = userRepository.findByRoleId(roleId);
        return users.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Méthodes utilitaires pour la conversion entre entités et DTOs
    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        // Remplir le DTO avec les données de l'utilisateur
        return dto;
    }

    private User convertToEntity(UserDto dto) {
        User user = new User();
        // Remplir l'entité avec les données du DTO
        return user;
    }

    private void updateUserFromDto(User user, UserDto dto) {
        // Mettre à jour l'utilisateur avec les données du DTO
    }
}