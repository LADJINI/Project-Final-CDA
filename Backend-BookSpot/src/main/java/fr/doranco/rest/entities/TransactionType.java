package fr.doranco.rest.entities;

import java.util.List;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "types_transaction")
@Getter
@Setter
public class TransactionType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_type_transaction")
    private Integer id;

    @Column(name = "type_transaction", nullable = false, unique = true)
    private String typeTransaction;
    
    @OneToMany(mappedBy = "typeTransaction")
    private List<Transaction> transactions;

    // Constructeur par défaut
    public TransactionType() {
    }

    // Constructeur avec type
    public TransactionType(String typeTransaction) {
        this.typeTransaction = typeTransaction;
    }
}
