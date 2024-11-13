package fr.doranco.rest.services;

import fr.doranco.rest.dto.BookDto;
import fr.doranco.rest.dto.PaymentDto;
import fr.doranco.rest.dto.TransactionDto;
import fr.doranco.rest.dto.TransactionRequestDTO;
import fr.doranco.rest.entities.Transaction;
import fr.doranco.rest.entities.TransactionType;
import fr.doranco.rest.entities.User;
import fr.doranco.rest.entities.Book;
import fr.doranco.rest.entities.Payment;
import fr.doranco.rest.repository.IBookRepository;
import fr.doranco.rest.repository.ITransactionRepository;
import fr.doranco.rest.repository.ITransactionTypeRepository;
import fr.doranco.rest.repository.IUserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;

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

    @Transactional
    public Transaction createTransaction(TransactionRequestDTO requestDTO) {
        // Vérifier si le type de transaction existe
        TransactionType transactionType = transactionTypeRepository.findById(requestDTO.getTypeTransactionId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid Transaction Type"));

        // Vérifier si l'utilisateur existe
        User user = userRepository.findByIdWithBooks(requestDTO.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Récupérer les livres par leurs IDs
        List<Book> booksList = bookRepository.findBooksWithUsers(requestDTO.getBookIds());
        if (booksList.isEmpty()) {
            throw new IllegalArgumentException("Books not found");
        }

        // Créer la transaction
        Transaction transaction = new Transaction();
        transaction.setTypeTransaction(transactionType);
        transaction.setPrice(requestDTO.getPrice());
        transaction.setStatus("en cours");  // Laissez le statut par défaut si nécessaire
        transaction.setUser(user);
        transaction.setBooks(new HashSet<>(booksList));
        transaction.startTransaction();

        // Sauvegarder la transaction dans la base de données
        return transactionRepository.save(transaction);
    }


    public List<Transaction> getAllTransactionsEntities() {
        return transactionRepository.findAll();
    }

    public Optional<Transaction> getTransactionEntityById(Integer id) {
        return transactionRepository.findById(id);
    }

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

    public List<TransactionDto> getAllTransactions() {
        return transactionRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public TransactionDto getTransactionById(Integer id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        return convertToDto(transaction);
    }
    
   
    /**
     * Convertit une entité `Payment` en un `PaymentDto`.
     * 
     * @param payment L'entité Payment à convertir.
     * @return Le DTO PaymentDto correspondant.
     */
    public PaymentDto convertPaymentToDto(Payment payment) {
        if (payment == null) {
            return null;
        }

        PaymentDto paymentDto = new PaymentDto();
        paymentDto.setId(payment.getId());
        paymentDto.setPaymentDate(payment.getPaymentDate());
        paymentDto.setPaymentMethod(payment.getPaymentMethod());
        paymentDto.setAmount(payment.getAmount());

        // Récupération des IDs des transactions associées au paiement
        List<Integer> transactionIds = payment.getTransactions().stream()
                .map(transaction -> transaction.getId())
                .collect(Collectors.toList());
        paymentDto.setTransactionIds(transactionIds);

        return paymentDto;
    }

    /**
     * Convertit un DTO `PaymentDto` en une entité `Payment`.
     * 
     * @param paymentDto Le DTO PaymentDto à convertir.
     * @return L'entité Payment correspondante.
     */
    public Payment convertDtoToPayment(PaymentDto paymentDto) {
        if (paymentDto == null) {
            return null;
        }

        Payment payment = new Payment();
        payment.setId(paymentDto.getId());
        payment.setPaymentDate(paymentDto.getPaymentDate());
        payment.setPaymentMethod(paymentDto.getPaymentMethod());
        payment.setAmount(paymentDto.getAmount());

        // Les transactions doivent être ajoutées séparément, donc nous n'ajoutons pas ici les transactions.
        // Si vous avez besoin de gérer les transactions, cela doit être fait à un autre endroit, dans le service associé.

        return payment;
    }

    /**
     * Convertit une entité `Book` en un `BookDto`.
     * 
     * @param book L'entité Book à convertir.
     * @return Le DTO BookDto correspondant.
     */
    public BookDto convertBookToDto(Book book) {
        if (book == null) {
            return null;
        }

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
        bookDto.setImageId(book.getImageId());

        return bookDto;
    }

    /**
     * Convertit un DTO `BookDto` en une entité `Book`.
     * 
     * @param bookDto Le DTO BookDto à convertir.
     * @return L'entité Book correspondante.
     */
    public Book convertDtoToBook(BookDto bookDto) {
        if (bookDto == null) {
            return null;
        }

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
        book.setImageId(bookDto.getImageId());

        return book;
    }

    
    

    public  TransactionDto convertToDto(Transaction transaction) {
        return TransactionDto.builder()
                .id(transaction.getId())
                .userId(transaction.getUser().getId())
                .transactionTypeId(transaction.getTypeTransaction().getId())
                .payment(convertPaymentToDto(transaction.getPayment()))
                .books(transaction.getBooks().stream().map(this::convertBookToDto).collect(Collectors.toSet()))
                .transactionDate(transaction.getTransactionDate())
                .price(transaction.getPrice())
                .status(transaction.getStatus())
                .startDate(transaction.getStartDate())
                .endDate(transaction.getEndDate())
                .build();
    }

    public  Transaction convertToEntity(TransactionDto transactionDto) {
        Transaction transaction = new Transaction();
        transaction.setId(transactionDto.getId());
        transaction.setUser(userRepository.findById(transactionDto.getUserId()).orElseThrow(() -> new IllegalArgumentException("User not found")));
        transaction.setTypeTransaction(transactionTypeRepository.findById(transactionDto.getTransactionTypeId()).orElseThrow(() -> new IllegalArgumentException("Transaction type not found")));
        transaction.setPayment(convertDtoToPayment(transactionDto.getPayment()));
        transaction.setBooks(transactionDto.getBooks().stream().map(this::convertDtoToBook).collect(Collectors.toSet()));
        transaction.setTransactionDate(transactionDto.getTransactionDate());
        transaction.setPrice(transactionDto.getPrice());
        transaction.setStatus(transactionDto.getStatus());
        transaction.setStartDate(transactionDto.getStartDate());
        transaction.setEndDate(transactionDto.getEndDate());
        return transaction;
    }

}
