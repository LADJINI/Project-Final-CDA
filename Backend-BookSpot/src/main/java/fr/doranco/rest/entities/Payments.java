package fr.doranco.rest.entities;

import java.util.List;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity

@Table(
	    name = "paiements",
	    uniqueConstraints = @UniqueConstraint(name = "PK_PAIEMENTS", columnNames = "id_paiment"))
@Getter
@Setter
@NoArgsConstructor 
public class Payments {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_paiment")
    private Integer id;

    @Column(name = "date_paiment", nullable = false)
    private LocalDateTime paymentDate;

    @Column(name = "mode_paiment", nullable = false)
    private String paymentMethod;

    @Column(name = "montant_paye" , length = 50, nullable = false)
    private Double amount;

    @OneToMany(mappedBy = "payment")
    private List<Transaction> transactions;
    
    public Payments(Double amount, String paymentMethod, LocalDateTime paymentDate) {
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.paymentDate = paymentDate;
    }

}
