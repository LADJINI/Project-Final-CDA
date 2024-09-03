package fr.doranco.rest.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.Set;

@Data
public class BookDto {
    private Long id;
    private String title;
    private String author;
    private String isbn;
    private String publisher;
    private LocalDate publicationDate;
    private Integer numberOfPages;
    private String bookCondition;
    private Boolean availability;
    private String description;
    private Integer quantityAvailable;
    private Double price;
    private Boolean published;
}
