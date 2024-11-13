package fr.doranco.rest.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransactionTypeDto {
    
    private Integer id;
    private String typeTransaction;

    // Constructeur sans argument
    public TransactionTypeDto() {}

    // Constructeur avec type de transaction
    public TransactionTypeDto(Integer id, String typeTransaction) {
        this.id = id;
        this.typeTransaction = typeTransaction;
    }
}
