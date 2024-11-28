package fr.doranco.rest.services;

import fr.doranco.rest.entities.TransactionTypes;
import fr.doranco.rest.dto.TransactionTypeDto;
import fr.doranco.rest.repository.ITransactionTypeRepository;
import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TransactionTypeService {

    private final ITransactionTypeRepository transactionTypeRepository;

    @Autowired
    public TransactionTypeService(ITransactionTypeRepository transactionTypeRepository) {
        this.transactionTypeRepository = transactionTypeRepository;
    }
    
    // Initialisation des types de transactions lors du démarrage
    @PostConstruct
    public void initTransactionTypes() {
        List<String> types = Arrays.asList("vente", "achat", "don", "beneficier_don");

        for (String type : types) {
            // Vérifie si le type existe déjà dans la base de données
            Optional<TransactionTypes> existingType = transactionTypeRepository.findByTypeTransaction(type);
            if (existingType.isEmpty()) {  // Java 11 ou supérieur
                transactionTypeRepository.save(new TransactionTypes(type));
            }
        }
    }

    /**
     * Récupère tous les types de transaction.
     * @return Une liste de DTO représentant les types de transaction.
     */
    
    public List<TransactionTypeDto> getAllTransactionTypes() {
        List<TransactionTypes> transactionTypes = transactionTypeRepository.findAll();
       return transactionTypes.stream()
               .map(type -> new TransactionTypeDto(type.getId(), type.getTypeTransaction()))
               .collect(Collectors.toList());
    }
 
    /**
     * Récupère un type de transaction par son identifiant.
     * @param id L'identifiant du type de transaction.
     * @return Un DTO représentant le type de transaction.
     */
    public TransactionTypeDto getTransactionTypeById(Integer id) {
        TransactionTypes transactionType = transactionTypeRepository.findById(id).orElse(null);
        if (transactionType != null) {
            return new TransactionTypeDto(transactionType.getId(), transactionType.getTypeTransaction());
        }
        return null;  // Ou bien lancer une exception si vous voulez une gestion plus stricte.
    }

    /**
     * Crée un nouveau type de transaction.
     * @param typeTransaction Le DTO contenant les informations du nouveau type de transaction.
     * @return Le DTO du type de transaction créé.
     */
    public TransactionTypeDto createTransactionType(TransactionTypeDto typeTransaction) {
        TransactionTypes transactionType = new TransactionTypes(typeTransaction.getTypeTransaction());
        TransactionTypes savedTransactionType = transactionTypeRepository.save(transactionType);
        return new TransactionTypeDto(savedTransactionType.getId(), savedTransactionType.getTypeTransaction());
    }

    /**
     * Supprime un type de transaction par son identifiant.
     * @param id L'identifiant du type de transaction à supprimer.
     */
    public void deleteTransactionType(Integer id) {
        transactionTypeRepository.deleteById(id);
    }
}
