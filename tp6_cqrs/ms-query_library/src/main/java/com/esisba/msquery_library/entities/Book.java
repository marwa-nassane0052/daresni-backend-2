package com.esisba.msquery_library.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Entity
@Data @AllArgsConstructor @NoArgsConstructor
public class Book {

    @Id
    private String isbn;
    private String title;
    @ManyToOne
    private Library library;
    private String editeurId;

}
