package fr.doranco.rest.entities;

import java.util.List;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity

@Table(
	    name = "types_transaction",
	    uniqueConstraints = @UniqueConstraint(name = "PK_TYPES_TRANSACTION", columnNames = "id_type_transaction"))
@Getter
@Setter
public class TransactionTypes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_type_transaction")
    private Integer id;

    @Column(name = "type_transaction" , length = 50, nullable = false, unique = true)
    private String typeTransaction;
    
    @OneToMany(mappedBy = "typeTransaction")
    private List<Transaction> transaction;

    // Constructeur par défaut
    public TransactionTypes() {
    }

    // Constructeur avec type
    public TransactionTypes(String typeTransaction) {
        this.typeTransaction = typeTransaction;
    }
}
