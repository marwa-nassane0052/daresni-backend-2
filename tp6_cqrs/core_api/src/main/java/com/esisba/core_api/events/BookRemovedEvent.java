package com.esisba.core_api.events;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookRemovedEvent {
    private String libraryId;
    private String isbn;
}
