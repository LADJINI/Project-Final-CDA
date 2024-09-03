package fr.doranco.rest.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fr.doranco.rest.entities.User;
import fr.doranco.rest.dto.UserDto;
import fr.doranco.rest.entities.Role;
import fr.doranco.rest.repository.IUserRepository;
import fr.doranco.rest.repository.IRoleRepository;
import fr.doranco.rest.exception.EmailAlreadyExistsException;
import fr.doranco.rest.exception.ResourceNotFoundException;

@Service
public class UserService {

    @Autowired
    private IUserRepository userRepository;
    
    @Autowired
    private IRoleRepository roleRepository;

    /**
     * Trouve un utilisateur par son email.
     * @param email L'email de l'utilisateur.
     * @return Optional contenant l'UserDto si trouvé.
     */
    @Transactional(readOnly = true)
    public Optional<UserDto> findByEmail(String email) {
        return userRepository.findByEmail(email).map(this::convertToDto);
    }

    /**
     * Récupère tous les utilisateurs.
     * @return Liste de tous les UserDto.
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
     * @return Optional contenant l'UserDto si trouvé.
     */
    @Transactional(readOnly = true)
    public Optional<UserDto> findById(Long id) {
        return userRepository.findById(id).map(this::convertToDto);
    }

    /**
     * Crée un nouvel utilisateur.
     * @param userDto Les données de l'utilisateur à créer.
     * @return L'UserDto créé.
     * @throws EmailAlreadyExistsException si l'email existe déjà.
     */
    @Transactional
    public UserDto createUser(UserDto userDto) throws EmailAlreadyExistsException {
        if (userRepository.findByEmail(userDto.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("Email already exists");
        }
        User user = convertToEntity(userDto);
        user = userRepository.save(user);
        return convertToDto(user);
    }

    @Transactional(readOnly = true)
    public Optional<User> findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    /**
     * Met à jour un utilisateur existant.
     * @param id L'ID de l'utilisateur à mettre à jour.
     * @param userDto Les nouvelles données de l'utilisateur.
     * @return L'UserDto mis à jour.
     * @throws ResourceNotFoundException si l'utilisateur n'est pas trouvé.
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
     * @throws ResourceNotFoundException si l'utilisateur n'est pas trouvé.
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
     * @return Liste des UserDto pour le rôle donné.
     */
    @Transactional(readOnly = true)
    public List<UserDto> findUsersByRoleId(Integer roleId) {
        return userRepository.findByRoleId(roleId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Convertit un User en UserDto.
     * @param user L'entité User à convertir.
     * @return L'UserDto correspondant.
     */
    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setNom(user.getNom());
        dto.setPrenom(user.getPrenom());
        dto.setSexe(user.getSexe());
        dto.setDateNaissance(user.getDateNaissance());
        dto.setEmail(user.getEmail());
        dto.setAddress(user.getAddress());
        dto.setTelephone(user.getTelephone());
        dto.setRegistrationDate(user.getRegistrationDate());
        dto.setActif(user.getActif());
        if (user.getRole() != null) {
            dto.setRoleId(user.getRole().getId());
        }
        return dto;
    }
    @Transactional(readOnly = true)
    public List<UserDto> findUserDtosByRoleId(Integer roleId) {
        List<User> users = userRepository.findByRoleId(roleId);
        return users.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    /**
     * Convertit un UserDto en User.
     * @param dto Le UserDto à convertir.
     * @return L'entité User correspondante.
     */
    private User convertToEntity(UserDto dto) {
        User user = new User();
        updateUserFromDto(user, dto);
        return user;
    }

    /**
     * Met à jour une entité User à partir d'un UserDto.
     * @param user L'entité User à mettre à jour.
     * @param dto Le UserDto contenant les nouvelles données.
     */
    private void updateUserFromDto(User user, UserDto dto) {
        user.setNom(dto.getNom());
        user.setPrenom(dto.getPrenom());
        user.setSexe(dto.getSexe());
        user.setDateNaissance(dto.getDateNaissance());
        user.setEmail(dto.getEmail());
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPassword(dto.getPassword());
        }
        user.setAddress(dto.getAddress());
        user.setTelephone(dto.getTelephone());
        user.setRegistrationDate(dto.getRegistrationDate());
        user.setActif(dto.getActif());
        if (dto.getRoleId() != null) {
            Role role = roleRepository.findById(dto.getRoleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + dto.getRoleId()));
            user.setRole(role);
        }
    }
}