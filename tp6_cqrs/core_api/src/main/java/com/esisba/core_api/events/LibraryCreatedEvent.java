package com.esisba.core_api.events;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LibraryCreatedEvent {
    private String libraryId;
    private String name;
}
