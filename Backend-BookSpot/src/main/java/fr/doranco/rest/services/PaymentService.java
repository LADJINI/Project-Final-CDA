package fr.doranco.rest.services;

import fr.doranco.rest.dto.PaymentDto;
import fr.doranco.rest.entities.Payment;
import fr.doranco.rest.repository.IPaymentRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service pour gérer les opérations liées aux paiements.
 */
@Service
public class PaymentService {

    private final IPaymentRepository paymentRepository;
    private final ModelMapper modelMapper;

    public PaymentService(IPaymentRepository paymentRepository, ModelMapper modelMapper) {
        this.paymentRepository = paymentRepository;
        this.modelMapper = modelMapper;
    }

    /**
     * Ajoute un nouveau paiement.
     *
     * @param paymentDto Les données du paiement à ajouter.
     * @return Le DTO du paiement créé.
     */
    public PaymentDto addPayment(PaymentDto paymentDto) {
        Payment payment = modelMapper.map(paymentDto, Payment.class);
        Payment savedPayment = paymentRepository.save(payment);
        return modelMapper.map(savedPayment, PaymentDto.class);
    }

    /**
     * Récupère tous les paiements.
     *
     * @return La liste des DTOs des paiements.
     */
    public List<PaymentDto> getAllPayments() {
        return paymentRepository.findAll()
                .stream()
                .map(payment -> modelMapper.map(payment, PaymentDto.class))
                .collect(Collectors.toList());
    }

    /**
     * Récupère un paiement par son identifiant.
     *
     * @param id L'identifiant du paiement à récupérer.
     * @return Le DTO du paiement ou null si non trouvé.
     */
    public PaymentDto getPaymentById(Integer id) {
        Optional<Payment> paymentOptional = paymentRepository.findById(id);
        return paymentOptional.map(payment -> modelMapper.map(payment, PaymentDto.class)).orElse(null);
    }

    /**
     * Met à jour un paiement existant.
     *
     * @param id         L'identifiant du paiement à mettre à jour.
     * @param paymentDto Les nouvelles données du paiement.
     * @return Le DTO du paiement mis à jour ou null si non trouvé.
     */
    public PaymentDto updatePayment(Integer id, PaymentDto paymentDto) {
        if (!paymentRepository.existsById(id)) {
            return null; // Le paiement n'existe pas
        }

        Payment paymentToUpdate = modelMapper.map(paymentDto, Payment.class);
        paymentToUpdate.setId(id); // S'assurer que l'ID est celui du paiement existant
        Payment updatedPayment = paymentRepository.save(paymentToUpdate);
        return modelMapper.map(updatedPayment, PaymentDto.class);
    }

    /**
     * Supprime un paiement par son identifiant.
     *
     * @param id L'identifiant du paiement à supprimer.
     * @return true si la suppression a réussi, false sinon.
     */
    public boolean deletePayment(Integer id) {
        if (!paymentRepository.existsById(id)) {
            return false; // Le paiement n'existe pas
        }
        paymentRepository.deleteById(id);
        return true;
    }
}
