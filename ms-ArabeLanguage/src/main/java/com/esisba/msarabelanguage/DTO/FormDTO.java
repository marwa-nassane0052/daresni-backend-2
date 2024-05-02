package com.esisba.msarabelanguage.DTO;


import com.esisba.msarabelanguage.entities.Language;
import com.esisba.msarabelanguage.entities.Linguistic;
import lombok.Data;

@Data
public class FormDTO {

    private Language language  ;
    private Linguistic linguistic ;
    private String level;

}
