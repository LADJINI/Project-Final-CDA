package fr.doranco.rest.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

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

}
