package com.esisba.msarabelanguage.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "steps")
@Data
@AllArgsConstructor @NoArgsConstructor
public class Step {

    private String title;
    private String description;
    private String rule;
    private List<String> exemples;
    private String question;
    private String answer;

}
