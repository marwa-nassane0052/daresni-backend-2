package com.esisba.mscommandlibrary.API;
import com.esisba.core_api.DTO.BookDTO;
import com.esisba.core_api.DTO.LibraryDTO;
import com.esisba.core_api.commande.AddBookCommand;
import com.esisba.core_api.commande.LibraryCreationCommand;
import com.esisba.core_api.commande.RemoveBookCommand;
import org.axonframework.commandhandling.gateway.CommandGateway;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("command")
public class CommandController {

    private final CommandGateway commandGateway;

    public CommandController(CommandGateway commandGateway) {
        this.commandGateway = commandGateway;
    }

    @PostMapping("library")
    public CompletableFuture<String> createLibrary(@RequestBody LibraryDTO libraryDTO){
        CompletableFuture<String> response= commandGateway.send(
                new LibraryCreationCommand(libraryDTO.getLibraryId(), libraryDTO.getName()));

        return  response;
    }

    @PostMapping("/library/{libraryid}/book")
    public CompletableFuture<String> addBook(@PathVariable String libraryid,
                                             @RequestBody BookDTO book) {
        CompletableFuture<String> response= commandGateway.send(new AddBookCommand(
                libraryid, book.getIsbn(), book.getTitle(), book.getEditeurId()));
        return response;
    }

    @DeleteMapping("/library/{libraryid}/{isbn}")
    public CompletableFuture<String> removeBook(@PathVariable String libraryid,
                                                @PathVariable String isbn) {
        CompletableFuture<String> response= commandGateway.send(
                new RemoveBookCommand(libraryid, isbn));
        return response;
    }
}

