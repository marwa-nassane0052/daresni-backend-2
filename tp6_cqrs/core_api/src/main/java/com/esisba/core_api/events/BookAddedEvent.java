package com.esisba.core_api.events;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookAddedEvent {
    private String libraryId;
    private String isbn;
    private String  title;
    private String editeurId;
}
