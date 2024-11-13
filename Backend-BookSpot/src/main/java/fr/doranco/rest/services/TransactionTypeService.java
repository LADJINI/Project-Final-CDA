package fr.doranco.rest.services;

import fr.doranco.rest.entities.TransactionType;
import fr.doranco.rest.dto.TransactionTypeDto;
import fr.doranco.rest.repository.ITransactionTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionTypeService {

    private final ITransactionTypeRepository transactionTypeRepository;

    @Autowired
    public TransactionTypeService(ITransactionTypeRepository transactionTypeRepository) {
        this.transactionTypeRepository = transactionTypeRepository;
    }

    /**
     * Récupère tous les types de transaction.
     * @return Une liste de DTO représentant les types de transaction.
     */
    
    public List<TransactionTypeDto> getAllTransactionTypes() {
        List<TransactionType> transactionTypes = transactionTypeRepository.findAll();
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
        TransactionType transactionType = transactionTypeRepository.findById(id).orElse(null);
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
        TransactionType transactionType = new TransactionType(typeTransaction.getTypeTransaction());
        TransactionType savedTransactionType = transactionTypeRepository.save(transactionType);
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
