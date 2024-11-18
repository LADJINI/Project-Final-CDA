package fr.doranco.rest.controllers;

import fr.doranco.rest.dto.TransactionTypeDto;
import fr.doranco.rest.services.TransactionTypeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/transaction-types")
public class TransactionTypeController {

    private final TransactionTypeService transactionTypeService;

    public TransactionTypeController(TransactionTypeService transactionTypeService) {
        this.transactionTypeService = transactionTypeService;
    }

    /**
     * Récupère tous les types de transaction.
     * @return Une liste des types de transaction.
     */
    
   
   @GetMapping
    public ResponseEntity<List<TransactionTypeDto>> getAllTransactionTypes() {
      List<TransactionTypeDto> transactionTypes = transactionTypeService.getAllTransactionTypes();
      return ResponseEntity.ok(transactionTypes);
    }

    /**
     * Récupère un type de transaction par son identifiant.
     * @param id L'identifiant du type de transaction.
     * @return Le type de transaction demandé.
     */
    @GetMapping("/{id}")
    public ResponseEntity<TransactionTypeDto> getTransactionTypeById(@PathVariable Integer id) {
        TransactionTypeDto transactionType = transactionTypeService.getTransactionTypeById(id);
        if (transactionType == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(transactionType);
    }

    /**
     * Crée un nouveau type de transaction.
     * @param typeTransaction Le DTO du nouveau type de transaction.
     * @return Le type de transaction créé.
     */
    @PostMapping
    public ResponseEntity<TransactionTypeDto> createTransactionType(@RequestBody TransactionTypeDto typeTransaction) {
        TransactionTypeDto createdTransactionType = transactionTypeService.createTransactionType(typeTransaction);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTransactionType);
    }

    /**
     * Supprime un type de transaction par son identifiant.
     * @param id L'identifiant du type de transaction à supprimer.
     * @return Le résultat de la suppression.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransactionType(@PathVariable Integer id) {
        transactionTypeService.deleteTransactionType(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
