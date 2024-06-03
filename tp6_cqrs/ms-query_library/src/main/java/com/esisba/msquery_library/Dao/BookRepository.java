package com.esisba.msquery_library.Dao;


import com.esisba.msquery_library.entities.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book,String> {
}
