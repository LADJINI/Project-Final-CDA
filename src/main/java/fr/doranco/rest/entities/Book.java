package fr.doranco.rest.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "livres")
@NamedQueries({
@NamedQuery(name = "book.findAllBooks",
                query = "FROM Book b WHERE b.title LIKE CONCAT('%',?1,'%') OR b.description LIKE CONCAT('%',?1,'%')")
})
@Entity
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.PROTECTED)
    @Column(name = "id_livre")
    private Long id;

    @Column(name = "titre", length = 50, nullable = false, unique = true)
    private String title;

    @Column(name = "auteur", length = 50)
    private String author;

    @Column(name = "isbn")
    private String isbn;

    @Column(name = "editeur", length = 50)
    private String publisher;

    @Column(name = "date_publication")
    private LocalDate publicationDate;

    @Column(name = "nombre_page")
    private Integer numberOfPages;

    @Column(name = "etat_livre", length = 50, nullable = false)
    private String bookCondition;

    @Column(name = "disponibilite")
    private Boolean availability;

    @Column(name = "description", columnDefinition = "TINYTEXT", nullable = false)
    private String description;

    @Column(name = "quantite_disponible")
    private Integer quantityAvailable;

    @Column(name = "prix_unitaire")
    private Double price;

    @Column(name = "publication", columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean published;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "book")
    private Set<Evaluation> evaluations;

    @ManyToMany
    @JoinTable(
        name = "livre_transaction",  
        joinColumns = @JoinColumn(name = "id_livre"),
        inverseJoinColumns = @JoinColumn(name = "id_transaction")
    )
    private Set<Transaction> transactions;
}