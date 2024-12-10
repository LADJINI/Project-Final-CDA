package fr.doranco.rest.controllers;

import fr.doranco.rest.dto.BookDto;
import fr.doranco.rest.dto.TransactionDto;
import fr.doranco.rest.dto.TransactionRequestDTO;
import fr.doranco.rest.entities.Transaction;
import fr.doranco.rest.services.TransactionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

/**
 * Contrôleur REST pour gérer les transactions.
 * Ce contrôleur expose des points de terminaison pour créer, récupérer et mettre à jour des transactions.
 */
@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:5174")
public class TransactionController {

    private static final Logger logger = LoggerFactory.getLogger(TransactionController.class);

    @Autowired
    private TransactionService transactionService;

    /**
     * Crée une nouvelle transaction avec les livres et le type de transaction.
     * 
     * @param requestDTO Le DTO contenant les informations nécessaires pour créer une transaction.
     * @return Une réponse contenant le DTO de la transaction créée avec un statut HTTP approprié.
     */
    @PostMapping("/create")
    public ResponseEntity<TransactionDto> createTransaction(@RequestBody TransactionRequestDTO requestDTO) {
        try {
            // Créer la transaction à partir du DTO Request
            Transaction transaction = transactionService.createTransaction(requestDTO);

            // Convertir l'entité Transaction en TransactionDto
            TransactionDto transactionDto = transactionService.convertToDto(transaction);
            
         
            // Retourner la transaction créée avec un statut HTTP 201 (Créé)
            return ResponseEntity.status(HttpStatus.CREATED).body(transactionDto);
        } catch (DataIntegrityViolationException e) {
            logger.error("Violation d'intégrité des données lors de la création de la transaction", e);
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null); // Conflit dû à des données incorrectes
        } catch (IllegalArgumentException e) {
            logger.error("Argument invalide fourni lors de la création de la transaction", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); // Mauvaise requête
        } catch (Exception e) {
            logger.error("Erreur interne lors de la création de la transaction", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // Erreur serveur interne
        }
    }

    /**
     * Récupère toutes les transactions existantes.
     * 
     * @return Une réponse contenant une liste de DTO de transactions avec un statut HTTP approprié.
     */
    @GetMapping
    public ResponseEntity<List<TransactionDto>> getAllTransactions() {
        try {
            // Récupérer toutes les transactions depuis le service
            List<Transaction> transaction = transactionService.getAllTransactions();

            // Si aucune transaction n'est trouvée, retourner un statut 404 (Non trouvé)
            if (transaction.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            // Conversion des transactions en DTO
            List<TransactionDto> transactionDtos = transaction.stream()
                    .map(transactionService::convertToDto)
                    .collect(Collectors.toList());

            // Retourner la liste des transactions converties avec un statut HTTP 200 (OK)
            return ResponseEntity.ok(transactionDtos);

        } catch (NoSuchElementException e) {
            // Gérer les exceptions si aucun élément n'est trouvé
            logger.error("Aucune transaction trouvée", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (IllegalArgumentException e) {
            // Gérer les erreurs d'argument
            logger.error("Argument invalide dans la requête", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception e) {
            // Gérer toutes les autres erreurs générales
            logger.error("Erreur lors de la récupération des transactions", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    
    @GetMapping("/user/{userId}/books")
    public ResponseEntity<List<BookDto>> getBooksForUser (@PathVariable Long userId) {
        try {
            List<BookDto> books = transactionService.getBooksForUser (userId);
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des livres pour l'utilisateur", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Récupère une transaction spécifique par son ID.
     * 
     * @param id L'ID de la transaction à récupérer.
     * @return Une réponse contenant le DTO de la transaction correspondante avec un statut HTTP approprié.
     */
    @GetMapping("/{id}")
    public ResponseEntity<TransactionDto> getTransactionById(@PathVariable Integer id) {
        try {
            // Récupérer la transaction par ID depuis le service
            Transaction transaction = transactionService.getTransactionById(id);
            
            // Convertir l'entité Transaction en DTO
            TransactionDto transactionDto = transactionService.convertToDto(transaction);

            // Retourner la transaction convertie avec un statut HTTP 200 (OK)
            return ResponseEntity.ok(transactionDto);
        } catch (Exception e) {
            // Gérer les erreurs lors de la récupération de la transaction par ID
            logger.error("Erreur lors de la récupération de la transaction avec l'ID: " + id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Met à jour le statut d'une transaction spécifique.
     * 
     * @param id L'ID de la transaction à mettre à jour.
     * @param status Le nouveau statut de la transaction ("en cours", "validée", ou "annulée").
     * @return Une réponse contenant le DTO de la transaction mise à jour avec un statut HTTP approprié.
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<TransactionDto> updateTransactionStatus(
            @PathVariable Integer id, 
            @RequestParam String status) {
        try {
            // Mettre à jour le statut de la transaction via le service
            Transaction transaction = transactionService.updateTransactionStatus(id, status);
            
            // Convertir l'entité Transaction mise à jour en DTO
            TransactionDto transactionDto = transactionService.convertToDto(transaction);

            // Retourner la transaction mise à jour avec un statut HTTP 200 (OK)
            return ResponseEntity.ok(transactionDto);
        } catch (NoSuchElementException e) {
            // Gérer le cas où la transaction n'est pas trouvée
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (IllegalArgumentException e) {
            // Gérer les erreurs d'argument pour le statut
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception e) {
            // Gérer toutes les autres erreurs générales
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}