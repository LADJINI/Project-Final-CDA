package fr.doranco.rest.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "transactions")
@Getter
@Setter
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
    private TransactionType typeTransaction;

    @ManyToOne
    @JoinColumn(name = "id_paiment", nullable = false)
    private Payment payment;

    @ManyToMany(mappedBy = "transactions")
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
}
