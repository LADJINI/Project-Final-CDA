package fr.doranco.rest.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

import fr.doranco.rest.entities.Payment;

/**
 * DTO pour représenter un paiement.
 */
@Getter
@Setter
public class PaymentDto {

    private Integer id; // Identifiant du paiement
    private LocalDateTime paymentDate; // Date du paiement
    private String paymentMethod; // Méthode de paiement
    private Double amount; // Montant payé
    private List<Integer> transactionIds; // Liste des identifiants des transactions associées

    
 // Constructeur sans arguments (par défaut)
    public PaymentDto() {}
    
    // Constructeur qui prend un objet Payment
    public PaymentDto(Payment payment) {
        this.id = payment.getId();
        this.paymentDate = payment.getPaymentDate();
        this.paymentMethod = payment.getPaymentMethod();
        this.amount = payment.getAmount();
        // On peut laisser transactionIds vide ici, car il faudra probablement charger les transactions associées à la demande
    }
}
