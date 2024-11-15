package fr.doranco.rest.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

/**
 * Entité représentant une transaction dans le système.
 * Elle contient les informations liées à une transaction, incluant l'utilisateur, 
 * le type de transaction, le paiement, les livres, les dates et le statut.
 */
@Data

@AllArgsConstructor
@Builder
@Entity
@Table(name = "transactions")
@Setter
@Getter
@NamedQueries({
    @NamedQuery(name = "transaction.findAll",
                query = "SELECT t FROM Transaction t WHERE t.status = :status")
})
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_transaction")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_utilisateur", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "id_type_transaction", nullable = false)
    private TransactionType typeTransaction; // Référence à TransactionType

    @ManyToOne(optional = true)  // Le paiement est optionnel
    @JoinColumn(name = "id_paiment")
    private Payment payment;

    // Utilisation de FetchType.EAGER pour charger immédiatement les livres associés
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "livre_transaction",
        joinColumns = @JoinColumn(name = "id_transaction"),
        inverseJoinColumns = @JoinColumn(name = "id_livre")
    )
      
    private Set<Book> books;


    @Column(name = "date_transaction", nullable = false)
    private LocalDateTime transactionDate;

    @Column(name = "prix", nullable = false)
    private Double price;

    @Column(name = "statut_transaction", length = 50, nullable = false)
    private String status;

    @Column(name = "date_debut_transaction")
    private LocalDateTime startDate;

    @Column(name = "date_fin_transaction")
    private LocalDateTime endDate;

    public Transaction() {
        this.transactionDate = LocalDateTime.now();
    }

    public void setBooks(Set<Book> books) {
        this.books = books;
    }

    public void setAmount(Double amount) {
        this.price = amount;
    }

    public void startTransaction() {
        this.status = "en cours";
        this.startDate = LocalDateTime.now();
    }

    public void validateTransaction() {
        this.status = "validée";
        this.endDate = LocalDateTime.now();
    }

    public void cancelTransaction() {
        this.status = "annulée";
        this.endDate = LocalDateTime.now();
    }

    public Payment getPayment() {
        return payment;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }

    public TransactionType getTypeTransaction() {
        return typeTransaction;
    }

    public void setTypeTransaction(TransactionType typeTransaction) {
        this.typeTransaction = typeTransaction;
    }

    public Double getAmount() {
        return this.price;
    }
}
