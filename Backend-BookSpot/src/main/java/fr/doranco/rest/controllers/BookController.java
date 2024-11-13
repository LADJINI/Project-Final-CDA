package fr.doranco.rest.controllers;

import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.GridFSBuckets;
import com.mongodb.client.gridfs.model.GridFSFile;
import com.mongodb.client.gridfs.model.GridFSUploadOptions;
import com.mongodb.client.result.DeleteResult;

import com.mongodb.client.MongoDatabase; // Ajoutez cette ligne pour MongoDatabase


import com.mongodb.client.model.Filters; // Pour Filters
import org.springframework.http.MediaType; // Pour MediaType
import java.io.ByteArrayOutputStream; // Pour ByteArrayOutputStream



import fr.doranco.rest.dto.BookDto;
import fr.doranco.rest.dto.TransactionDto;
import fr.doranco.rest.dto.UserDto;
import fr.doranco.rest.entities.Book;

import fr.doranco.rest.entities.Payment;
import fr.doranco.rest.entities.Transaction;
import fr.doranco.rest.entities.TransactionType;
import fr.doranco.rest.entities.User;
import fr.doranco.rest.repository.IBookRepository;
import fr.doranco.rest.repository.ITransactionRepository;
import fr.doranco.rest.repository.ITransactionTypeRepository;
import fr.doranco.rest.services.TransactionService;
import fr.doranco.rest.services.UserService;
import jakarta.servlet.http.HttpServletRequest;

import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.time.LocalDateTime;
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
    @Autowired
    private UserService userService;
    
    @Autowired
    private ITransactionTypeRepository transactionTypeRepository;

    @Autowired
    private GridFSBucket gridFSBucket;  // Injection du bucket GridFS pour MongoDB
    
    @Autowired
    private MongoDatabase mongoDatabase; // Ajoutez cette ligne pour injecter MongoDatabase
    @Autowired
    private TransactionService transactionService;

    /**
     * Récupère tous les livres, avec une option de filtrage par titre.
     *
     * @param text Le texte de recherche pour filtrer les livres par titre (optionnel).
     * @return Liste de BookDto ou une erreur 500 en cas d'échec.
     */
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
    
   
    /**
     * Endpoint pour ajouter un livre avec une image conditionné par la connexion de l'utilisateur ou création de compte.
     *
     * @param bookDto   Les données du livre.
     * @param imageFile Fichier image uploadé pour le livre.
     * @param principal Détails de l'utilisateur connecté.
     * @param request   HttpServletRequest pour journaliser le type de contenu.
     * @return Réponse HTTP avec les détails du livre ajouté ou une erreur 500 en cas d'échec.
     */

    @PostMapping("/books")
    public ResponseEntity<?> addBook(
            @RequestPart("book") BookDto bookDto,
            @RequestPart(value = "image", required = false) MultipartFile imageFile,
            Principal principal,  // Utilisé pour récupérer l'utilisateur connecté
            HttpServletRequest request
    ) {
        logger.info("Received request with Content-Type: " + request.getContentType());
        try {
            // Vérifier que l'utilisateur est connecté
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User must be logged in.");
            }

            // Récupération de l'email à partir du Principal et recherche de l'utilisateur dans la base
            String email = principal.getName();
            UserDto userDto = userService.findByEmail(email).orElse(null);  // Utilisation de findByEmail

            if (userDto == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found.");
            }

            // Convertir UserDto en User
            User user = userService.convertToEntity(userDto);

            // Associer l'utilisateur au livre
            Book book = convertToEntity(bookDto);
            book.setUser(user);
            
            // Sauvegarde du livre dans MySQL
            Book savedBook = bookRepository.save(book);

            // Si une image est fournie, la stocker dans MongoDB
            if (imageFile != null && !imageFile.isEmpty()) {
                ObjectId imageId = saveImageToMongoDB(imageFile);
                savedBook.setImageId(imageId.toHexString());
                bookRepository.save(savedBook);  // Mise à jour avec l'ID de l'image
            }
           
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDto(savedBook));

        } catch (Exception e) {
            logger.error("Erreur lors de l'ajout d'un livre", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while adding the book.");
        }
    }

    /**
     * Sauvegarde une image dans MongoDB GridFS.
     *
     * @param imageFile Le fichier image.
     * @return ObjectId L'identifiant unique de l'image stockée.
     * @throws IOException en cas d'erreur lors du téléchargement.
     */
    private ObjectId saveImageToMongoDB(MultipartFile imageFile) throws IOException {
        GridFSUploadOptions options = new GridFSUploadOptions()
                .metadata(new org.bson.Document("type", "image")
                        .append("content_type", imageFile.getContentType()));

        // Téléversement du fichier image dans MongoDB
        ObjectId imageId = gridFSBucket.uploadFromStream(imageFile.getOriginalFilename(),
                imageFile.getInputStream(), options);
        logger.info("Image sauvegardée dans MongoDB avec l'ID: " + imageId);
        return imageId;
    }

    /**
     * Récupère image par son ID.
     *
     * @param id L'identifiant du limage.
     * @return Détails du image ou une erreur 404 si non trouvé.
     */
    @GetMapping("/imageFile/{imageId}")
    public ResponseEntity<byte[]> getImage(@PathVariable("imageId") String id) {
        try {
            GridFSBucket gridFSBucket = GridFSBuckets.create(mongoDatabase);
            GridFSFile gridFSFile = gridFSBucket.find(Filters.eq("_id", new ObjectId(id))).first();

            if (gridFSFile == null) {
                return ResponseEntity.notFound().build();
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            gridFSBucket.downloadToStream(gridFSFile.getObjectId(), outputStream);
            byte[] imageBytes = outputStream.toByteArray();
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(gridFSFile.getMetadata().getString("content_type")))
                    .body(imageBytes);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération de l'image avec l'ID: " + id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }



    /**
     * Récupère un livre par son ID.
     *
     * @param id L'identifiant du livre.
     * @return Détails du livre ou une erreur 404 si non trouvé.
     */
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

    /**
     * Met à jour un livre existant.
     *
     * @param id        L'identifiant du livre à mettre à jour.
     * @param bookDto   Les nouvelles données du livre.
     * @param imageFile (optionnel) Fichier image pour remplacer l'image actuelle.
     * @return Le livre mis à jour ou une erreur 404 si non trouvé.
     */
    @PutMapping("/books/{id}")
    public ResponseEntity<BookDto> updateBook(
            @PathVariable("id") long id,
            @RequestPart("book") BookDto bookDto,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        try {
            // Vérification des champs obligatoires
            if (bookDto == null || bookDto.getTitle() == null || bookDto.getTitle().trim().isEmpty()
                    || bookDto.getDescription() == null || bookDto.getDescription().trim().isEmpty()
                    || bookDto.getAuthor() == null || bookDto.getAuthor().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            // Recherche du livre à mettre à jour
            Optional<Book> bookOptional = bookRepository.findById(id);
            if (bookOptional.isPresent()) {
                Book book = bookOptional.get();
                updateBookFromDto(book, bookDto); // Mise à jour des champs

                // Si une nouvelle image est fournie, on remplace l'ancienne
                if (imageFile != null && !imageFile.isEmpty()) {
                    // Vérification du type de fichier image
                    if (!imageFile.getContentType().startsWith("image/")) {
                        return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body(null);
                    }

                    // Sauvegarde de la nouvelle image dans MongoDB et récupération du nouvel ObjectId
                    ObjectId newImageId = saveImageToMongoDB(imageFile);
                    book.setImageId(newImageId.toHexString()); // Mise à jour de l'imageId
                }

                Book updatedBook = bookRepository.save(book);
                logger.info("Livre mis à jour avec succès : " + updatedBook.getTitle());
                return ResponseEntity.ok(convertToDto(updatedBook));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Erreur lors de la mise à jour du livre avec l'ID: " + id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Supprime un livre par son ID.
     *
     * @param id L'identifiant du livre à supprimer.
     * @return Réponse vide ou une erreur 404 si non trouvé.
     */
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

    /**
     * Convertit une entité Book en DTO BookDto.
     *
     * @param book L'entité Book à convertir.
     * @return Le DTO BookDto correspondant.
     */
    private BookDto convertToDto(Book book) {
        BookDto dto = new BookDto();
        book.setId(dto.getId());
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
        dto.setImageId(book.getImageId());  // Ajout de l'ID de l'image
        return dto;
    }

    /**
     * Convertit un DTO BookDto en entité Book.
     *
     * @param dto Le DTO BookDto à convertir.
     * @return L'entité Book correspondante.
     */
    private Book convertToEntity(BookDto dto) {
    	
        Book book = new Book();
        
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
        book.setImageId(dto.getImageId());  // Ajout de l'ID de l'image
        return book;
    }

    /**
     * Met à jour un livre existant avec les données d'un DTO BookDto.
     *
     * @param book L'entité Book à mettre à jour.
     * @param dto  Le DTO BookDto contenant les nouvelles données.
     */
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

        // Mise à jour de l'imageId si présent dans le DTO
        if (dto.getImageId() != null && !dto.getImageId().isEmpty()) {
            book.setImageId(dto.getImageId());
        }
    }
}
