package com.esisba.core_api.commande;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.axonframework.modelling.command.TargetAggregateIdentifier;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class AddBookCommand {
    @TargetAggregateIdentifier
    private String libraryId;
    private String isbn;
    private String  title;
    private String editeurId;
}
