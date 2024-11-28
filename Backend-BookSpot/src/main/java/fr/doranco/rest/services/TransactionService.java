package fr.doranco.rest.services;

import fr.doranco.rest.dto.BookDto;
import fr.doranco.rest.dto.PaymentDto;
import fr.doranco.rest.dto.TransactionDto;
import fr.doranco.rest.dto.TransactionRequestDTO;
import fr.doranco.rest.entities.Transaction;
import fr.doranco.rest.entities.TransactionTypes;
import fr.doranco.rest.entities.User;
import fr.doranco.rest.entities.Book;
import fr.doranco.rest.entities.Payments;
import fr.doranco.rest.repository.IBookRepository;
import fr.doranco.rest.repository.ITransactionRepository;
import fr.doranco.rest.repository.ITransactionTypeRepository;
import fr.doranco.rest.repository.IUserRepository;
import jakarta.transaction.Transactional;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    @Autowired
    private ITransactionRepository transactionRepository;
    @Autowired
    private ITransactionTypeRepository transactionTypeRepository;
    @Autowired
    private IUserRepository userRepository;
    @Autowired
    private IBookRepository bookRepository;
   

    /**
     * Crée une nouvelle transaction en fonction des informations fournies.
     * 
     * @param requestDTO Objet DTO contenant les informations nécessaires pour créer une transaction.
     * @return La transaction nouvellement créée et sauvegardée en base de données.
     * @throws IllegalArgumentException Si le type de transaction, l'utilisateur ou les livres sont introuvables.
     */
    @Transactional
    public Transaction createTransaction(TransactionRequestDTO requestDTO) {
        Transaction transaction = new Transaction();
        
        // Définir le type de transaction
        TransactionTypes typeTransaction = transactionTypeRepository.findById(requestDTO.getTypeTransactionId())
                .orElseThrow(() -> new IllegalArgumentException("Type de transaction non trouvé"));
        transaction.setTypeTransaction(typeTransaction);

        // Ajouter les livres associés
        Set<Book> books = requestDTO.getBookIds().stream()
                .map(bookRepository::findById)
                .map(book -> book.orElseThrow(() -> new IllegalArgumentException("Livre non trouvé")))
                .collect(Collectors.toSet());
        transaction.setBooks(books);
        
        // Autres champs de la transaction
        transaction.setPrice(requestDTO.getPrice());
        transaction.setUser(userRepository.findById(requestDTO.getUserId()).orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé")));
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setStatus("en cours");
        transaction.setStartDate(LocalDateTime.now());  // Par exemple, début de la transaction
        
        // Aucune mention de `booksList` nécessaire ici
        transaction.startTransaction();

        // Sauvegarder la transaction
        transactionRepository.save(transaction);
        
        return transaction;
    }


    /**
     * Récupère toutes les transactions de la base de données.
     * 
     * @return Liste de toutes les transactions.
     */
    @Transactional
    public List<Transaction> getAllTransactions() {
    	
            return transactionRepository.findAll();
    }

    /**
     * Récupère une transaction spécifique par son ID, avec les livres associés.
     * 
     * @param id L'ID de la transaction à récupérer.
     * @return La transaction correspondante.
     * @throws NoSuchElementException Si aucune transaction n'est trouvée avec l'ID spécifié.
     */
    @Transactional
    public Transaction getTransactionById(Integer id) {
        return transactionRepository.findByIdWithBooks(id)
               .orElseThrow(() -> new NoSuchElementException("Transaction not found"));
    }

    /**
     * Récupère une transaction avec les livres associés et convertit le résultat en TransactionDto.
     * 
     * @param id L'ID de la transaction à récupérer.
     * @return Un objet TransactionDto représentant la transaction et les livres associés.
     * @throws RuntimeException Si la transaction n'est pas trouvée.
     */
    @Transactional
    public TransactionDto getTransactionWithBooks(Integer id) {
        // Récupérer la transaction avec les livres associés
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        // Initialiser explicitement les livres associés (lazy loading)
        Hibernate.initialize(transaction.getBooks());

        // Convertir la transaction en TransactionDto
        return convertToDto(transaction);
    }


    /**
     * Met à jour le statut d'une transaction spécifique.
     * 
     * @param id L'ID de la transaction à mettre à jour.
     * @param status Le nouveau statut de la transaction ("en cours", "validée", ou "annulée").
     * @return La transaction mise à jour.
     * @throws IllegalArgumentException Si le statut est invalide ou si la mise à jour n'est pas permise.
     * @throws RuntimeException Si la transaction n'est pas trouvée.
     */
    @Transactional
    public Transaction updateTransactionStatus(Integer id, String status) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        switch (status.toLowerCase()) {
            case "en cours":
                if (!transaction.getStatus().equals("en attente")) {
                    throw new IllegalArgumentException("Cannot restart a non-pending transaction");
                }
                transaction.startTransaction();
                break;
            case "validée":
                if (!transaction.getStatus().equals("en cours")) {
                    throw new IllegalArgumentException("Only transactions in progress can be validated");
                }
                transaction.validateTransaction();
                break;
            case "annulée":
                if (transaction.getStatus().equals("validée")) {
                    throw new IllegalArgumentException("Cannot cancel a validated transaction");
                }
                transaction.cancelTransaction();
                break;
            default:
                throw new IllegalArgumentException("Invalid status");
        }

        return transactionRepository.save(transaction);
    }

    /**
     * Convertit une transaction en TransactionDto en initialisant explicitement les livres associés.
     * 
     * @param transaction L'entité Transaction à convertir.
     * @return Un TransactionDto représentant la transaction.
     */
    @Transactional
    public TransactionDto convertToDto(Transaction transaction) {
        // Initialisation explicite des livres si nécessaire
        // On s'assure que la collection des livres est bien initialisée
        Hibernate.initialize(transaction.getBooks());

        // Récupération des livres en une seule requête via une méthode dédiée
        Set<BookDto> bookDtos = transaction.getBooks().stream()
                .map(this::convertBookToDto)
                .collect(Collectors.toSet());
        
        // Retour du DTO de transaction avec tous les détails
        return new TransactionDto(
                transaction.getId(),
                transaction.getUser().getId(),
                transaction.getTypeTransaction().getId(),
                convertPaymentToDto(transaction.getPayment()),
                bookDtos, // Les livres sont maintenant transformés en BookDto
                transaction.getTransactionDate(),
                transaction.getPrice(),
                transaction.getStatus(),
                transaction.getStartDate(),
                transaction.getEndDate()
        );
    }


    /**
     * Convertit un DTO de transaction en une entité Transaction.
     * 
     * @param transactionDto Le DTO TransactionDto à convertir.
     * @return L'entité Transaction correspondante.
     * @throws IllegalArgumentException Si l'utilisateur ou le type de transaction est introuvable.
     */
    public Transaction convertToEntity(TransactionDto transactionDto) {
        Transaction transaction = new Transaction();
        transaction.setId(transactionDto.getId());
        
        // Récupération de l'utilisateur et du type de transaction
        transaction.setUser(userRepository.findById(transactionDto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found")));
        transaction.setTypeTransaction(transactionTypeRepository.findById(transactionDto.getTransactionTypeId())
                .orElseThrow(() -> new IllegalArgumentException("Transaction type not found")));
        
        // Conversion du paiement
        transaction.setPayment(convertDtoToPayment(transactionDto.getPayment()));
        
        // Optimisation : récupération des livres en une seule requête avec findAllById
        List<Long> bookIds = transactionDto.getBooks().stream()
                .map(BookDto::getId) // On récupère les IDs des livres
                .collect(Collectors.toList());
        
        List<Book> book = bookRepository.findAllById(bookIds); // Récupération de tous les livres en une seule requête
        transaction.setBooks(new HashSet<>(book)); // On associe les livres à la transaction
        
        // Réglage des autres propriétés de la transaction
        transaction.setTransactionDate(transactionDto.getTransactionDate());
        transaction.setPrice(transactionDto.getPrice());
        transaction.setStatus(transactionDto.getStatus());
        transaction.setStartDate(transactionDto.getStartDate());
        transaction.setEndDate(transactionDto.getEndDate());
        
        return transaction;
    }

    // Conversion Helpers

    /**
     * Convertit une entité Payment en PaymentDto.
     * 
     * @param payment L'entité Payment à convertir.
     * @return Un PaymentDto représentant le paiement.
     */
    public PaymentDto convertPaymentToDto(Payments payment) {
        if (payment == null) return null;

        PaymentDto paymentDto = new PaymentDto();
        paymentDto.setId(payment.getId());
        paymentDto.setPaymentDate(payment.getPaymentDate());
        paymentDto.setPaymentMethod(payment.getPaymentMethod());
        paymentDto.setAmount(payment.getAmount());
        paymentDto.setTransactionIds(payment.getTransactions().stream()
                .map(Transaction::getId)
                .collect(Collectors.toList()));
        return paymentDto;
    }

    /**
     * Convertit un PaymentDto en une entité Payment.
     * 
     * @param paymentDto Le DTO PaymentDto à convertir.
     * @return L'entité Payment correspondante.
     */
    public Payments convertDtoToPayment(PaymentDto paymentDto) {
        if (paymentDto == null) return null;

        Payments payment = new Payments();
        payment.setId(paymentDto.getId());
        payment.setPaymentDate(paymentDto.getPaymentDate());
        payment.setPaymentMethod(paymentDto.getPaymentMethod());
        payment.setAmount(paymentDto.getAmount());
        return payment;
    }

    /**
     * Convertit une entité Book en BookDto.
     * 
     * @param book L'entité Book à convertir.
     * @return Un BookDto représentant le livre.
     */
    public BookDto convertBookToDto(Book book) {
        if (book == null) return null;

        BookDto bookDto = new BookDto();
        bookDto.setId(book.getId());
        bookDto.setTitle(book.getTitle());
        bookDto.setAuthor(book.getAuthor());
        bookDto.setIsbn(book.getIsbn());
        bookDto.setPublisher(book.getPublisher());
        bookDto.setPublicationDate(book.getPublicationDate());
        bookDto.setNumberOfPages(book.getNumberOfPages());
        bookDto.setBookCondition(book.getBookCondition());
        bookDto.setAvailability(book.getAvailability());
        bookDto.setDescription(book.getDescription());
        bookDto.setQuantityAvailable(book.getQuantityAvailable());
        bookDto.setPrice(book.getPrice());
        bookDto.setPublished(book.getPublished());
        return bookDto;
    }

    /**
     * Convertit un BookDto en une entité Book.
     * 
     * @param bookDto Le DTO BookDto à convertir.
     * @return L'entité Book correspondante.
     */
    public Book convertDtoToBook(BookDto bookDto) {
        if (bookDto == null) return null;

        Book book = new Book();
        book.setId(bookDto.getId());
        book.setTitle(bookDto.getTitle());
        book.setAuthor(bookDto.getAuthor());
        book.setIsbn(bookDto.getIsbn());
        book.setPublisher(bookDto.getPublisher());
        book.setPublicationDate(bookDto.getPublicationDate());
        book.setNumberOfPages(bookDto.getNumberOfPages());
        book.setBookCondition(bookDto.getBookCondition());
        book.setAvailability(bookDto.getAvailability());
        book.setDescription(bookDto.getDescription());
        book.setQuantityAvailable(bookDto.getQuantityAvailable());
        book.setPrice(bookDto.getPrice());
        book.setPublished(bookDto.getPublished());
        return book;
    }
}