package com.esisba.msquery_library.Dao;

import com.esisba.msquery_library.entities.Library;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LibraryRepository extends JpaRepository<Library,String> {
}
