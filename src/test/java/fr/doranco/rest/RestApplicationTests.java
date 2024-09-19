package fr.doranco.rest;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import fr.doranco.rest.entities.Book;
import fr.doranco.rest.repository.IBookRepository;

@SpringBootTest
class RestApplicationTests {

    @Autowired
    IBookRepository bookRepo;
    
    private Book book1, book2;
    
    @BeforeEach
    public void setupTestData() {
        book1 = Book.builder()
                .title("Java - initiation")
                .author("John Doe")
                .isbn("1234567890")
                .publisher("TechBooks")
                .publicationDate(LocalDate.of(2022, 1, 1))
                .numberOfPages(300)
                .bookCondition("New")
                .availability(true)
                .description("Livre complet de Java avec exercices")
                .quantityAvailable(10)
                .price(29.99)
                .published(true)
                .build();

        book2 = Book.builder()
                .title("Java - perfectionnement")
                .author("Jane Doe")
                .isbn("0987654321")
                .publisher("TechBooks")
                .publicationDate(LocalDate.of(2023, 2, 15))
                .numberOfPages(350)
                .bookCondition("Used")
                .availability(false)
                .description("Livre avancé de Java avec plus d'exercices")
                .quantityAvailable(5)
                .price(34.99)
                .published(true)
                .build();
    }
    
    @Test
    @DisplayName("Test unitaire de la création d'un book")
    public void testSaveBook() {
        // Arrange
        Book savedBook = bookRepo.save(book1);
        
        // Assert
        assertThat(savedBook).isNotNull();
        assertThat(savedBook.getId()).isGreaterThan(0);
        assertThat(savedBook.getTitle()).isEqualTo(book1.getTitle());
        assertThat(savedBook.getAuthor()).isEqualTo(book1.getAuthor());
        assertThat(savedBook.getIsbn()).isEqualTo(book1.getIsbn());
        assertThat(savedBook.getPublisher()).isEqualTo(book1.getPublisher());
        assertThat(savedBook.getPublicationDate()).isEqualTo(book1.getPublicationDate());
        assertThat(savedBook.getNumberOfPages()).isEqualTo(book1.getNumberOfPages());
        assertThat(savedBook.getBookCondition()).isEqualTo(book1.getBookCondition());
        assertThat(savedBook.getAvailability()).isEqualTo(book1.getAvailability());
        assertThat(savedBook.getDescription()).isEqualTo(book1.getDescription());
        assertThat(savedBook.getQuantityAvailable()).isEqualTo(book1.getQuantityAvailable());
        assertThat(savedBook.getPrice()).isEqualTo(book1.getPrice());
        assertThat(savedBook.getPublished()).isEqualTo(book1.getPublished());
        
        // Clean up
        bookRepo.delete(savedBook);
    }

    @Test
    @DisplayName("Test unitaire de la suppression d'un book")
    public void testRemoveBook() {
        // Arrange
        Book savedBook = bookRepo.save(book2);
        
        // Act
        bookRepo.delete(savedBook);
        Optional<Book> optionalBook = bookRepo.findById(savedBook.getId());
        
        // Assert
        assertThat(optionalBook).isEmpty();
    }
}
