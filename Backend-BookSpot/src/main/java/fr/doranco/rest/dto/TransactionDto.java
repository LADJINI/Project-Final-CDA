package fr.doranco.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDto {

    private Integer id; // Identifiant de la transaction
    
    private Long userId; // ID de l'utilisateur associé à la transaction
    
    private Integer transactionTypeId; // ID du type de transaction

    private PaymentDto payment; // Paiement associé à la transaction

    private Set<BookDto> books = new HashSet<>(); // Liste des livres associés à la transaction
    
    private LocalDateTime transactionDate; // Date de la transaction

    private Double price; // Montant total de la transaction
    
    private String status; // Statut de la transaction ("en cours", "validée", "annulée")

    private LocalDateTime startDate; // Date de début de la transaction

    private LocalDateTime endDate; // Date de fin de la transaction

    public void addBook(BookDto book) {
        this.books.add(book);
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
