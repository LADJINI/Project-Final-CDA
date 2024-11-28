package fr.doranco.rest.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.Set;

import fr.doranco.rest.dto.BookDto;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(
	    name = "livres",
	    uniqueConstraints = @UniqueConstraint(name = "PK_LIVRES", columnNames = "id_livre"))
@NamedQueries({
@NamedQuery(name = "book.findAllBooks",
                query = "FROM Book b WHERE b.title LIKE CONCAT('%',?1,'%') OR b.description LIKE CONCAT('%',?1,'%')")
})
@Entity

public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_livre")
    private Long id;

    @Column(name = "titre", length = 100, nullable = false)
    private String title;

    @Column(name = "auteur", length = 100, nullable = false)
    private String author;

    @Column(name = "isbn")
    private String isbn;

    @Column(name = "editeur", length = 100)
    private String publisher;

    @Column(name = "date_publication")
    private LocalDate publicationDate;

    @Column(name = "nombre_page")
    private Integer numberOfPages;

    @Column(name = "etat_livre", length = 50, nullable = false)
    private String bookCondition;

    @Column(name = "disponibilite",  nullable = false)
    private Boolean availability;

    @Column(name = "description", columnDefinition = "TINYTEXT",length = 1000, nullable = false)
    private String description;

    @Column(name = "quantite_disponible",  nullable = false)
    private Integer quantityAvailable;

    @Column(name = "prix_unitaire",  nullable = false)
    private Double price;

    @Column(name = "publication", columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean published;
    
    @Column(name = "image_id", length = 50)
    private String imageId ;
    
    

    @OneToMany(mappedBy = "book")
    private Set<Evaluations> evaluations;

  
    @ManyToMany
    @JoinTable(
        name = "livres_transactions",  
        joinColumns = @JoinColumn(name = "id_livre"),
        inverseJoinColumns = @JoinColumn(name = "id_transaction")
    )
    private Set<Transaction> transaction;
    
    
    /**
     * Met à jour les attributs d'un livre à partir d'un DTO.
     *
     * @param bookDto Le DTO contenant les nouvelles données.
     */
    public void updateFromDto(BookDto bookDto) {
        this.title = bookDto.getTitle();
        this.author = bookDto.getAuthor();
        this.isbn = bookDto.getIsbn();
        this.publisher = bookDto.getPublisher();
        this.publicationDate = bookDto.getPublicationDate();
        this.numberOfPages = bookDto.getNumberOfPages();
        this.bookCondition = bookDto.getBookCondition();
        this.availability = bookDto.getAvailability();
        this.description = bookDto.getDescription();
        this.quantityAvailable = bookDto.getQuantityAvailable();
        this.price = bookDto.getPrice();
        this.published = bookDto.getPublished();
        this.imageId = bookDto.getImageId();
    }

}