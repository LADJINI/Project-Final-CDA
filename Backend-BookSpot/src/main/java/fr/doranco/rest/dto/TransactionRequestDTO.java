package fr.doranco.rest.dto;

import java.util.List;

public class TransactionRequestDTO {

    private Integer typeTransactionId;  // ID du type de transaction
    private Double price;               // Montant de la transaction
    private String status;              // Statut de la transaction
    private Long userId;                // ID de l'utilisateur
    private List<Long> bookIds;         // Liste des IDs des livres

    // Getters et Setters
    public Integer getTypeTransactionId() {
        return typeTransactionId;
    }

    public void setTypeTransactionId(Integer typeTransactionId) {
        this.typeTransactionId = typeTransactionId;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<Long> getBookIds() {
        return bookIds;
    }

    public void setBookIds(List<Long> bookIds) {
        this.bookIds = bookIds;
    }
}
