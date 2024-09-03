package fr.doranco.rest.controllers;

import fr.doranco.rest.dto.BookDto;
import fr.doranco.rest.entities.Book;
import fr.doranco.rest.repository.IBookRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:8086")
@RestController
@RequestMapping("/api")
public class BookController {

    private static final Logger logger = LoggerFactory.getLogger(BookController.class);

    @Autowired
    private IBookRepository bookRepository;

    @GetMapping("/books")
    public ResponseEntity<List<BookDto>> getAllBooks(@RequestParam(required = false) String text) {
        try {
            List<Book> books;
            if (text == null || text.trim().isEmpty()) {
                books = bookRepository.findAll();
            } else {
                books = bookRepository.findByTitleContaining(text);
            }
            List<BookDto> bookDtos = books.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(bookDtos);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des livres", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/books")
    public ResponseEntity<BookDto> addBook(@RequestBody BookDto bookDto) {
        try {
            if (bookDto == null || bookDto.getTitle() == null || bookDto.getTitle().trim().isEmpty()
                    || bookDto.getDescription() == null || bookDto.getDescription().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            Book book = convertToEntity(bookDto);
            Book savedBook = bookRepository.save(book);
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDto(savedBook));
        } catch (Exception e) {
            logger.error("Erreur lors de l'ajout d'un livre", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/books/{id}")
    public ResponseEntity<BookDto> getBookById(@PathVariable("id") long id) {
        try {
            Optional<Book> bookOptional = bookRepository.findById(id);
            return bookOptional
                    .map(book -> ResponseEntity.ok(convertToDto(book)))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération du livre avec l'ID: " + id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/books/{id}")
    public ResponseEntity<BookDto> updateBook(@PathVariable("id") long id, @RequestBody BookDto bookDto) {
        try {
            if (bookDto == null || bookDto.getTitle() == null || bookDto.getTitle().trim().isEmpty()
                    || bookDto.getDescription() == null || bookDto.getDescription().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            Optional<Book> bookOptional = bookRepository.findById(id);
            if (bookOptional.isPresent()) {
                Book book = bookOptional.get();
                updateBookFromDto(book, bookDto);
                Book updatedBook = bookRepository.save(book);
                return ResponseEntity.ok(convertToDto(updatedBook));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Erreur lors de la mise à jour du livre avec l'ID: " + id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/books/{id}")
    public ResponseEntity<Void> removeBook(@PathVariable("id") long id) {
        try {
            if (id <= 0) {
                return ResponseEntity.badRequest().build();
            }
            if (!bookRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            bookRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("Erreur lors de la suppression du livre avec l'ID: " + id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private BookDto convertToDto(Book book) {
        BookDto dto = new BookDto();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setAuthor(book.getAuthor());
        dto.setIsbn(book.getIsbn());
        dto.setPublisher(book.getPublisher());
        dto.setPublicationDate(book.getPublicationDate());
        dto.setNumberOfPages(book.getNumberOfPages());
        dto.setBookCondition(book.getBookCondition());
        dto.setAvailability(book.getAvailability());
        dto.setDescription(book.getDescription());
        dto.setQuantityAvailable(book.getQuantityAvailable());
        dto.setPrice(book.getPrice());
        dto.setPublished(book.getPublished());
        return dto;
    }

    private Book convertToEntity(BookDto dto) {
        Book book = new Book();
        updateBookFromDto(book, dto);
        return book;
    }

    private void updateBookFromDto(Book book, BookDto dto) {
        book.setTitle(dto.getTitle());
        book.setAuthor(dto.getAuthor());
        book.setIsbn(dto.getIsbn());
        book.setPublisher(dto.getPublisher());
        book.setPublicationDate(dto.getPublicationDate());
        book.setNumberOfPages(dto.getNumberOfPages());
        book.setBookCondition(dto.getBookCondition());
        book.setAvailability(dto.getAvailability());
        book.setDescription(dto.getDescription());
        book.setQuantityAvailable(dto.getQuantityAvailable());
        book.setPrice(dto.getPrice());
        book.setPublished(dto.getPublished());
    }
}