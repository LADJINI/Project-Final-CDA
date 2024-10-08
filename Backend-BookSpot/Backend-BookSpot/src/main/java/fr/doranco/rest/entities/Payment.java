package fr.doranco.rest.entities;

import java.util.List;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "paiements")
@Getter
@Setter
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_paiment")
    private Integer id;

    @Column(name = "date_paiment", nullable = false)
    private LocalDateTime paymentDate;

    @Column(name = "mode_paiment", nullable = false)
    private String paymentMethod;

    @Column(name = "montant_paye", nullable = false)
    private Double amount;

    @OneToMany(mappedBy = "payment")
    private List<Transaction> transactions;
}
