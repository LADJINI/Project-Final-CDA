package fr.doranco.rest.controllers;

import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.model.GridFSFile;
import com.mongodb.client.gridfs.model.GridFSUploadOptions;
import com.mongodb.client.model.Filters;

import fr.doranco.rest.dto.BookDto;
import fr.doranco.rest.entities.Book;
import fr.doranco.rest.entities.TransactionTypes;
import fr.doranco.rest.entities.User;
import fr.doranco.rest.repository.IBookRepository;
import fr.doranco.rest.services.BookService;
import jakarta.servlet.http.HttpServletRequest;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/books")
public class BookController {

    private static final Logger logger = LoggerFactory.getLogger(BookController.class);

    @Autowired
    private BookService bookService;

    @Autowired
    private GridFSBucket gridFSBucket;

    /**
     * Récupère tous les livres avec option de recherche par mot-clé.
     *
     * @param keyword (optionnel) Le texte à rechercher dans les titres ou descriptions.
     * @return La liste des livres trouvés.
     */
    @GetMapping
    public ResponseEntity<List<BookDto>> getAllBooks(@RequestParam(required = false) String keyword) {
        try {
            List<BookDto> books = bookService.getBooks(keyword);
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des livres", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     *Récupère tous les livres de chaque utilisateur par type de transaction
     */
    
    @GetMapping("/user/{userId}/type/{typeId}")
    public List<Book> getBooksByUserAndType(@PathVariable Long userId, @PathVariable Integer typeId) {
        User user = new User();
        user.setId(userId); // Vous pouvez récupérer l'utilisateur de la base de données si nécessaire

        TransactionTypes typeTransaction = new TransactionTypes();
        typeTransaction.setId(typeId); // Vous pouvez récupérer le type de transaction de la base de données si nécessaire

        return bookService.getBooksByUserAndType(user, typeTransaction);
    }
    /**
     *Récupère tous les livres  par type de transaction
     */
    @GetMapping("/type/{typeId}")
    public List<Book> getBooksByType(@PathVariable Integer typeId) {
        TransactionTypes typeTransaction = new TransactionTypes();
        typeTransaction.setId(typeId); // Vous pouvez récupérer le type de transaction de la base de données si nécessaire

        return bookService.getBooksByType(typeTransaction);
    }

    
    /**
     * Ajoute un nouveau livre.
     *
     * @param bookDto   Les données du livre à ajouter.
     * @param imageFile (optionnel) Image associée au livre.
     * @param principal L'utilisateur connecté.
     * @return Le livre créé.
     */
    @PostMapping
    public ResponseEntity<?> addBook(
            @RequestPart("book") BookDto bookDto,
            @RequestPart(value = "image", required = false) MultipartFile imageFile,  // Déclaration de imageFile ici
            Principal principal) {
        try {
            // Appeler le service pour ajouter le livre avec l'image (si présente)
            BookDto savedBook = bookService.addBook(bookDto, imageFile, principal);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedBook);
        } catch (Exception e) {
            logger.error("Erreur lors de l'ajout d'un livre", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    
    @PutMapping("/{id}/add-to-transaction")
    public ResponseEntity<BookDto> addBookToTransaction(@PathVariable("id") long id, 
                                                         @RequestParam("transactionId") Integer transactionId,
                                                         @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        try {
            // Appeler le service pour ajouter le livre à la transaction avec l'image (si présente)
            BookDto updatedBook = bookService.addBookToTransaction(id, transactionId, imageFile);
            
            // Retourner la réponse avec le livre mis à jour
            return ResponseEntity.ok(updatedBook);
        } catch (Exception e) {
            logger.error("Erreur lors de l'ajout du livre à la transaction", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    /**
     * Récupère un livre par son ID.
     *
     * @param id L'identifiant du livre.
     * @return Le livre trouvé ou une erreur 404 si non trouvé.
     */
    @GetMapping("/{id}")
    public ResponseEntity<BookDto> getBookById(@PathVariable("id") long id) {
        try {
            BookDto book = bookService.getBookById(id);
            return ResponseEntity.ok(book);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération du livre", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();  // 404 si non trouvé
        }
    }

    /**
     * Met à jour un livre existant.
     *
     * @param id        L'identifiant du livre à mettre à jour.
     * @param bookDto   Les nouvelles données du livre.
     * @param imageFile (optionnel) Nouvelle image associée.
     * @return Le livre mis à jour.
     */
    @PutMapping("/{id}")
    public ResponseEntity<BookDto> updateBook(
            @PathVariable("id") long id,
            @RequestPart("book") BookDto bookDto,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        try {
            BookDto updatedBook = bookService.updateBook(id, bookDto, imageFile);
            return ResponseEntity.ok(updatedBook);
        } catch (Exception e) {
            logger.error("Erreur lors de la mise à jour du livre", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Supprime un livre par ID.
     *
     * @param id L'identifiant du livre.
     * @return Réponse HTTP.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable("id") long id) {
        try {
            bookService.deleteBook(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("Erreur lors de la suppression du livre", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Récupère une image stockée dans MongoDB par son ID.
     *
     * @param imageId L'ID de l'image.
     * @return L'image en format byte array.
     */
    @GetMapping("/image/{imageId}")
    public ResponseEntity<byte[]> getImage(@PathVariable String imageId) {
        try {
            // Appeler le service pour récupérer les données de l'image
            byte[] imageBytes = bookService.getImageById(imageId);

            // Définir le type MIME depuis les métadonnées de l'image (facultatif)
            GridFSFile gridFSFile = gridFSBucket.find(Filters.eq("_id", new ObjectId(imageId))).first();
            String contentType = gridFSFile.getMetadata().getString("content_type");

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(imageBytes);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération de l'image", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
