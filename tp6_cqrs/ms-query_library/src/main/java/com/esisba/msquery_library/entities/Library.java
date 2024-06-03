package com.esisba.msquery_library.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data @AllArgsConstructor @NoArgsConstructor
public class Library {

    @Id
    private String libraryId;
    private String name;

    @OneToMany (mappedBy = "library")
    private List<Book> Books;
}
