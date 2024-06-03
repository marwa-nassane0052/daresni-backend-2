package com.esisba.msarabelanguage.DTO;

import lombok.Data;

import java.util.List;
@Data
public class StepDTO {

    private String title;
    private String rule;
    private String description;
    private List<String> exemples;
    private String question;
    private String answer;
}
