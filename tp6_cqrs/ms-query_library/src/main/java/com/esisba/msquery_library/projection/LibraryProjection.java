package com.esisba.msquery_library.projection;


import com.esisba.core_api.events.BookAddedEvent;
import com.esisba.core_api.events.BookRemovedEvent;
import com.esisba.core_api.events.LibraryCreatedEvent;
import com.esisba.msquery_library.Dao.BookRepository;
import com.esisba.msquery_library.Dao.LibraryRepository;
import com.esisba.msquery_library.entities.Book;
import com.esisba.msquery_library.entities.Library;
import org.axonframework.eventhandling.EventHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class LibraryProjection {
    @Autowired
    private LibraryRepository libraryRepository;
    @Autowired
    private BookRepository bookRepository;

    @EventHandler
    public void  AddLibrary(LibraryCreatedEvent event)
    {
        Library library=new Library(event.getLibraryId(), event.getName(), null);
        libraryRepository.save(library);
    }

    @EventHandler
    public void addBook(BookAddedEvent event){
        Library library=libraryRepository.findById(event.getLibraryId()).get();

        bookRepository.save(
                new Book(event.getIsbn(), event.getTitle(), library, event.getEditeurId()));
    }

    @EventHandler
    public void removebook(BookRemovedEvent event) {

        bookRepository.deleteById(event.getIsbn());
    }
}
