package fr.doranco.rest.services;

import fr.doranco.rest.dto.BookDto;
import fr.doranco.rest.entities.Book;
import fr.doranco.rest.entities.Transaction;
import fr.doranco.rest.entities.TransactionTypes;
import fr.doranco.rest.entities.User;
import fr.doranco.rest.repository.IBookRepository;
import fr.doranco.rest.repository.ITransactionRepository;
import fr.doranco.rest.repository.ITransactionTypeRepository;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.model.GridFSFile;
import com.mongodb.client.gridfs.model.GridFSUploadOptions;
import com.mongodb.client.model.Filters;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookService {
    
    @Autowired
    private GridFSBucket gridFSBucket;

    @Autowired
    private IBookRepository bookRepository;

    @Autowired
    private ITransactionRepository transactionRepository;
    
    @Autowired
    private ITransactionTypeRepository transactionTypeRepository;

    /**
     * Récupère tous les livres ou filtre par mot-clé.
     *
     * @param keyword (optionnel) Texte pour la recherche.
     * @return Liste des livres correspondants.
     */
    public List<BookDto> getBooks(String keyword) {
        List<Book> book = (keyword == null || keyword.trim().isEmpty())
                ? bookRepository.findAll()
                : bookRepository.findByTitleContaining(keyword);
        return book.stream().map(this::convertToDto).collect(Collectors.toList());
    }
    
    /**
      Récupère les livres  par utilisateur et type de transaction
     */
    public List<Book> getBooksByUserAndType(User user, TransactionTypes typeTransaction) {
        return bookRepository.findBooksByUserAndType(user, typeTransaction);
    }
    
    /**
     * Récupère les livres par type de transaction
     */
    public List<Book> getBooksByType(TransactionTypes typeTransaction) {
        return bookRepository.findBooksByType(typeTransaction);
    }


    /**
     * Ajoute un nouveau livre.
     *
     * @param bookDto   Les données du livre.
     * @param imageFile (optionnel) Image associée.
     * @param principal L'utilisateur connecté.
     * @return Livre ajouté.
     */
    public BookDto addBook(BookDto bookDto, MultipartFile imageFile, Principal principal) {
        Book book = convertToEntity(bookDto);
        // Gestion des images et stockage MongoDB (si applicable)
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                // Sauvegarder l'image dans MongoDB
                ObjectId imageId = saveImageToMongoDB(imageFile);
                book.setImageId(imageId.toHexString());  // Associer l'ID de l'image au livre
            } catch (IOException e) {
                throw new RuntimeException("Erreur lors de l'enregistrement de l'image", e);
            }
        }
        bookRepository.save(book);
        return convertToDto(book);
    }

    public BookDto addBookToTransaction(long bookId, Integer transactionId, MultipartFile imageFile) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Livre non trouvé"));
        
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new IllegalArgumentException("Transaction non trouvée"));

        // Ajouter la transaction au livre
        book.getTransaction().add(transaction);
        
        // Gestion des images et stockage MongoDB (si applicable)
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                // Sauvegarder l'image dans MongoDB
                ObjectId imageId = saveImageToMongoDB(imageFile);
                book.setImageId(imageId.toHexString());  // Associer l'ID de l'image au livre
            } catch (IOException e) {
                throw new RuntimeException("Erreur lors de l'enregistrement de l'image", e);
            }
        }

        // Sauvegarder le livre avec l'ID de l'image (si présente)
        bookRepository.save(book);
        return convertToDto(book);
    }

    /**
     * Sauvegarde une image dans MongoDB via GridFS.
     *
     * @param imageFile Le fichier image à sauvegarder.
     * @return L'ObjectId généré par GridFS pour l'image.
     * @throws IOException Si une erreur se produit lors de l'enregistrement.
     */
    public ObjectId saveImageToMongoDB(MultipartFile imageFile) throws IOException {
        // Créer un flux d'entrée à partir du fichier
        byte[] fileBytes = imageFile.getBytes();

        // Créer les options de téléchargement (en indiquant le type MIME)
        GridFSUploadOptions options = new GridFSUploadOptions()
                .chunkSizeBytes(1024)  // Taille des morceaux
                .metadata(new org.bson.Document("content_type", imageFile.getContentType()));

        // Sauvegarder le fichier dans MongoDB via GridFS
        ObjectId fileId = gridFSBucket.uploadFromStream(imageFile.getOriginalFilename(), 
                                                       new java.io.ByteArrayInputStream(fileBytes), 
                                                       options);
        
        return fileId;  // Retourner l'ObjectId de l'image sauvegardée
    }

    /**
     * Met à jour un livre existant.
     *
     * @param id        L'identifiant du livre.
     * @param bookDto   Les nouvelles données.
     * @param imageFile Nouvelle image associée (optionnel).
     * @return Livre mis à jour.
     */
    public BookDto updateBook(long id, BookDto bookDto, MultipartFile imageFile) {
        Optional<Book> optionalBook = bookRepository.findById(id);
        if (!optionalBook.isPresent()) {
            throw new RuntimeException("Livre non trouvé");
        }
        Book book = optionalBook.get();
        book.updateFromDto(bookDto);
        // Gestion de l'image si fournie
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                // Sauvegarder l'image dans MongoDB
                ObjectId imageId = saveImageToMongoDB(imageFile);
                book.setImageId(imageId.toHexString());  // Associer l'ID de l'image au livre
            } catch (IOException e) {
                throw new RuntimeException("Erreur lors de l'enregistrement de l'image", e);
            }
        }
        bookRepository.save(book);
        return convertToDto(book);
    }
    
    /**
     * Récupère un livre par son identifiant.
     *
     * @param id L'identifiant du livre.
     * @return Le livre trouvé ou une exception si non trouvé.
     */
    public BookDto getBookById(long id) {
        Optional<Book> optionalBook = bookRepository.findById(id);
        if (!optionalBook.isPresent()) {
            throw new RuntimeException("Livre non trouvé");
        }
        return convertToDto(optionalBook.get());
    }

    /**
     * Supprime un livre par ID.
     *
     * @param id Identifiant du livre.
     */
    public void deleteBook(long id) {
        if (!bookRepository.existsById(id)) {
            throw new RuntimeException("Livre non trouvé");
        }
        bookRepository.deleteById(id);
    }
    
    /**
     * Récupère une image par son ID depuis MongoDB GridFS.
     *
     * @param imageId L'ID de l'image à récupérer.
     * @return Les données de l'image sous forme de tableau d'octets.
     * @throws RuntimeException si une erreur survient ou si l'image n'existe pas.
     */
    public byte[] getImageById(String imageId) {
        try {
            GridFSFile gridFSFile = gridFSBucket.find(Filters.eq("_id", new ObjectId(imageId))).first();
            if (gridFSFile == null) {
                throw new RuntimeException("Image non trouvée pour l'ID : " + imageId);
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            gridFSBucket.downloadToStream(gridFSFile.getObjectId(), outputStream);
            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la récupération de l'image", e);
        }
    }

    /**
     * Convertit une entité Book en DTO BookDto.
     */
    private BookDto convertToDto(Book book) {
        return BookDto.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .isbn(book.getIsbn())
                .publisher(book.getPublisher())
                .publicationDate(book.getPublicationDate())
                .numberOfPages(book.getNumberOfPages())
                .bookCondition(book.getBookCondition())
                .availability(book.getAvailability())
                .description(book.getDescription())
                .quantityAvailable(book.getQuantityAvailable())
                .price(book.getPrice())
                .published(book.getPublished())
                .imageId(book.getImageId())
                .build();
    }

    /**
     * Convertit un DTO BookDto en entité Book.
     */
    private Book convertToEntity(BookDto dto) {
        return Book.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .author(dto.getAuthor())
                .isbn(dto.getIsbn())
                .publisher(dto.getPublisher())
                .publicationDate(dto.getPublicationDate())
                .numberOfPages(dto.getNumberOfPages())
                .bookCondition(dto.getBookCondition())
                .availability(dto.getAvailability())
                .description(dto.getDescription())
                .quantityAvailable(dto.getQuantityAvailable())
                .price(dto.getPrice())
                .published(dto.getPublished())
                .imageId(dto.getImageId())
                .build();
    }
}
