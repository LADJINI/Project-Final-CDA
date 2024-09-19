package fr.doranco.rest;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import fr.doranco.rest.entities.User;
import fr.doranco.rest.repository.IUserRepository;
import jakarta.transaction.Transactional;

@SpringBootTest
@Transactional
class UserServiceTests {

    @Autowired
    IUserRepository userRepo;

    private User user1, user2;

    @BeforeEach
    public void setupTestData() {
        user1 = User.builder()
            .nom("John")
            .prenom("Doe")
            .dateNaissance(LocalDate.of(1990, 1, 1))
            .email("john6.doe@example.com")
            .password("testPassword")
            .address("123 Main St")
            .telephone("1234567890")
            .registrationDate(LocalDate.now())
            .actif(true)
            .build();

        user2 = User.builder()
            .nom("Jane")
            .prenom("Doe")
            .dateNaissance(LocalDate.of(1995, 5, 15))
            .email("jane5.doe@example.com")
            .password("testPassword2")
            .address("456 Elm St")
            .telephone("0987654321")
            .registrationDate(LocalDate.now())
            .actif(false)
            .build();

        System.out.println("User1 after build: " + user1);
        System.out.println("User1 password after build: " + user1.getPassword());
        System.out.println("User2 after build: " + user2);
        System.out.println("User2 password after build: " + user2.getPassword());
    }

    @Test
    @DisplayName("Test unitaire de la création d'un utilisateur")
    public void testSaveUser() {
        System.out.println("User1 before save: " + user1);
        System.out.println("User1 password before save: " + user1.getPassword());
        
        User savedUser = userRepo.save(user1);
        
        System.out.println("SavedUser after save: " + savedUser);
        System.out.println("SavedUser password after save: " + savedUser.getPassword());
        
        assertThat(savedUser).isNotNull();
        assertThat(savedUser.getId()).isGreaterThan(0);
        assertThat(savedUser.getNom()).isEqualTo(user1.getNom());
        assertThat(savedUser.getPrenom()).isEqualTo(user1.getPrenom());
        assertThat(savedUser.getDateNaissance()).isEqualTo(user1.getDateNaissance());
        assertThat(savedUser.getEmail()).isEqualTo(user1.getEmail());
        assertThat(savedUser.getPassword()).isNotNull().isNotEmpty().isEqualTo(user1.getPassword());
        assertThat(savedUser.getAddress()).isEqualTo(user1.getAddress());
        assertThat(savedUser.getTelephone()).isEqualTo(user1.getTelephone());
        assertThat(savedUser.getRegistrationDate()).isEqualTo(user1.getRegistrationDate());
        assertThat(savedUser.getActif()).isEqualTo(user1.getActif());
        
        // Vérification supplémentaire en récupérant l'utilisateur de la base de données
        User retrievedUser = userRepo.findById(savedUser.getId()).orElse(null);
        assertThat(retrievedUser).isNotNull();
        assertThat(retrievedUser.getPassword()).isNotNull().isNotEmpty().isEqualTo(user1.getPassword());
        
        userRepo.delete(savedUser);
    }

    // ... autres méthodes de test ...

    @Test
    @DisplayName("Test spécifique pour la sauvegarde du mot de passe")
    public void testSaveUserPassword() {
        User user = User.builder()
            .nom("Test")
            .prenom("User")
            .email("test.user@example.com")
            .password("specificTestPassword")
            .dateNaissance(LocalDate.of(1990, 1, 1))
            .telephone("1234567890")
            .registrationDate(LocalDate.now())
            .build();
        
        System.out.println("User before save: " + user);
        System.out.println("User password before save: " + user.getPassword());
        
        User savedUser = userRepo.save(user);
        
        System.out.println("SavedUser after save: " + savedUser);
        System.out.println("SavedUser password after save: " + savedUser.getPassword());
        
        assertThat(savedUser.getPassword()).isNotNull().isNotEmpty().isEqualTo("specificTestPassword");
        
        // Vérification supplémentaire en récupérant l'utilisateur de la base de données
        User retrievedUser = userRepo.findById(savedUser.getId()).orElse(null);
        assertThat(retrievedUser).isNotNull();
        assertThat(retrievedUser.getPassword()).isNotNull().isNotEmpty().isEqualTo("specificTestPassword");
    }

    @Test
    @DisplayName("Test unitaire de la suppression d'un utilisateur")
    public void testRemoveUser() {
        User savedUser = userRepo.save(user2);
        userRepo.delete(savedUser);
        Optional<User> optionalUser = userRepo.findById(savedUser.getId());
        assertThat(optionalUser).isEmpty();
    }

    @Test
    @DisplayName("Test unitaire de la recherche d'un utilisateur par email")
    public void testFindUserByEmail() {
        // Sauvegarde de l'utilisateur
        User savedUser = userRepo.save(user1);
        
        // Vérification que l'utilisateur a été sauvegardé correctement
        assertThat(savedUser).isNotNull();
        assertThat(savedUser.getId()).isNotNull();

        // Recherche de l'utilisateur par email
        Optional<User> optionalUser = userRepo.findByEmail(user1.getEmail());
        
        // Vérifications
        assertThat(optionalUser).isPresent();
        assertThat(optionalUser.get().getEmail()).isEqualTo(user1.getEmail());
        assertThat(optionalUser.get().getId()).isEqualTo(savedUser.getId());

        // Nettoyage (optionnel si vous utilisez @Transactional sur la classe de test)
        userRepo.delete(optionalUser.get());
    }

    @Test
    @DisplayName("Test unitaire de la recherche d'un utilisateur par email inexistant")
    public void testFindUserByEmailNotFound() {
        Optional<User> optionalUser = userRepo.findByEmail("nonexistent@example.com");
        assertThat(optionalUser).isEmpty();
    }
    @Test
    @DisplayName("Test unitaire de la mise à jour d'un utilisateur")
    public void testUpdateUser() {
        User savedUser = userRepo.save(user1);
        savedUser.setNom("UpdatedName");
        User updatedUser = userRepo.save(savedUser);
        
        assertThat(updatedUser.getNom()).isEqualTo("UpdatedName");
        assertThat(updatedUser.getId()).isEqualTo(savedUser.getId());
    }
    @Test
    @DisplayName("Test unitaire de la recherche d'un utilisateur par ID")
    public void testFindUserById() {
        User savedUser = userRepo.save(user1);
        
        Optional<User> foundUser = userRepo.findById(savedUser.getId());
        
        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getId()).isEqualTo(savedUser.getId());
        assertThat(foundUser.get().getEmail()).isEqualTo(savedUser.getEmail());
    }
}
