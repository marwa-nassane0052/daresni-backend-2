package com.esisba.msarabelanguage.DTO.Level;

import com.esisba.msarabelanguage.entities.Linguistic;
import lombok.Data;


@Data
public class ListLevelsDTO {
    private Long id;
    private String name;
    private Linguistic linguistic;
}

