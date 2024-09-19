package fr.doranco.rest.entities;

import java.util.List;
import jakarta.persistence.*;
import lombok.Getter;
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

    @Column(name = "type", length = 50, nullable = false)
    private String type;

    @OneToMany(mappedBy = "typeTransaction")
    private List<Transaction> transactions;
}
