package fr.doranco.rest.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.Set;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class BookDto {

    private Long id;

    @NotBlank(message = "Le titre est requis.")
    @Size(max = 50, message = "Le titre ne doit pas dépasser 50 caractères.")
    private String title;

    @Size(max = 50, message = "L'auteur ne doit pas dépasser 50 caractères.")
    private String author;

    private String isbn;

    @Size(max = 50, message = "L'éditeur ne doit pas dépasser 50 caractères.")
    private String publisher;

    private LocalDate publicationDate;

    private Integer numberOfPages;

    @NotBlank(message = "L'état du livre est requis.")
    @Size(max = 50, message = "L'état du livre ne doit pas dépasser 50 caractères.")
    private String bookCondition;

    private Boolean availability;

    @NotBlank(message = "La description est requise.")
    private String description;

    private Integer quantityAvailable;

    private Double price;

    private Boolean published;

    private String imageId; // ID de l'image dans MongoDB

}
