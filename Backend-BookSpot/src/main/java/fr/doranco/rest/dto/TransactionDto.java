package fr.doranco.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import fr.doranco.rest.entities.Transaction;
@Getter
@Setter
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDto {

    private Integer id; // Identifiant de la transaction
    
    private Long userId; // ID de l'utilisateur associé à la transaction
    
    private Integer transactionTypeId; // ID du type de transaction

    private PaymentDto payment; // Paiement associé à la transaction
    @Builder.Default
    private Set<BookDto> books = new HashSet<>(); // Liste des livres associés à la transaction
   
    private LocalDateTime transactionDate; // Date de la transaction

    private Double price; // Montant total de la transaction
    
    private String status; // Statut de la transaction ("en cours", "validée", "annulée")

    private LocalDateTime startDate; // Date de début de la transaction

    private LocalDateTime endDate; // Date de fin de la transaction

    public void addBook(BookDto book) {
        this.books.add(book);
    }
    // Constructeur qui prend une entité Transaction pour initialiser un DTO
    public TransactionDto(Transaction transaction) {
        this.id = transaction.getId();
        this.userId = transaction.getUser().getId();
        this.transactionTypeId = transaction.getTypeTransaction().getId();
        this.payment = new PaymentDto(transaction.getPayment());  // Utilisation du constructeur PaymentDto
        this.books = transaction.getBooks().stream()
                .map(book -> new BookDto(book))  // Utilisation du constructeur BookDto
                .collect(Collectors.toSet());
        this.transactionDate = transaction.getTransactionDate();
        this.price = transaction.getPrice();
        this.status = transaction.getStatus();
        this.startDate = transaction.getStartDate();
        this.endDate = transaction.getEndDate();
    }
    
    
    /**
     * Méthode pour initier une transaction (statut "en cours").
     */
    public void startTransaction() {
        this.status = "en cours";
        this.startDate = LocalDateTime.now();
    }

    /**
     * Méthode pour valider une transaction (statut "validée").
     */
    public void validateTransaction() {
        this.status = "validée";
        this.endDate = LocalDateTime.now();
    }

    /**
     * Méthode pour annuler une transaction (statut "annulée").
     */
    public void cancelTransaction() {
        this.status = "annulée";
        this.endDate = LocalDateTime.now();
    }
}
