package fr.doranco.rest.controllers;

import fr.doranco.rest.dto.PaymentDto;
import fr.doranco.rest.entities.Payment;
import fr.doranco.rest.services.PaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Contrôleur pour gérer les paiements.
 */

@CrossOrigin(origins = "http://localhost:8086")
@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * Ajoute un nouveau paiement.
     *
     * @param paymentDto Les données du paiement à ajouter.
     * @return La réponse HTTP avec le paiement créé.
     */
    @PostMapping
    public ResponseEntity<PaymentDto> createPayment(@RequestBody PaymentDto paymentDto) {
        PaymentDto createdPayment = paymentService.addPayment(paymentDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPayment);
    }

    /**
     * Récupère tous les paiements.
     *
     * @return La liste de tous les paiements.
     */
    @GetMapping
    public ResponseEntity<List<PaymentDto>> getAllPayments() {
        List<PaymentDto> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }

    /**
     * Récupère un paiement par son identifiant.
     *
     * @param id L'identifiant du paiement à récupérer.
     * @return La réponse HTTP avec le paiement trouvé ou une erreur 404 si non trouvé.
     */
    @GetMapping("/{id}")
    public ResponseEntity<PaymentDto> getPaymentById(@PathVariable Integer id) {
        PaymentDto paymentDto = paymentService.getPaymentById(id);
        return paymentDto != null ? ResponseEntity.ok(paymentDto) : ResponseEntity.notFound().build();
    }

    /**
     * Met à jour un paiement existant.
     *
     * @param id         L'identifiant du paiement à mettre à jour.
     * @param paymentDto Les nouvelles données du paiement.
     * @return La réponse HTTP avec le paiement mis à jour ou une erreur 404 si non trouvé.
     */
    @PutMapping("/{id}")
    public ResponseEntity<PaymentDto> updatePayment(@PathVariable Integer id, @RequestBody PaymentDto paymentDto) {
        PaymentDto updatedPayment = paymentService.updatePayment(id, paymentDto);
        return updatedPayment != null ? ResponseEntity.ok(updatedPayment) : ResponseEntity.notFound().build();
    }

    /**
     * Supprime un paiement par son identifiant.
     *
     * @param id L'identifiant du paiement à supprimer.
     * @return La réponse HTTP indiquant si la suppression a réussi.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Integer id) {
        boolean isDeleted = paymentService.deletePayment(id);
        return isDeleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
