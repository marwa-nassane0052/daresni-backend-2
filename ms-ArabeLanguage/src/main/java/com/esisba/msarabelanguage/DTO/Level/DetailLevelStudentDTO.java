package com.esisba.msarabelanguage.DTO.Level;

import com.esisba.msarabelanguage.entities.Linguistic;
import com.esisba.msarabelanguage.entities.Step;
import lombok.Data;

import java.util.List;

//for student
@Data
public class DetailLevelStudentDTO {
    private Long id;
    private String name;
    private Linguistic linguistic;
    private List<Step> steps;
    private String examn;
    private int currentStep;
}
