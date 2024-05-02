package com.esisba.msarabelanguage.entities;

import com.esisba.msarabelanguage.models.StudentAuth;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor @NoArgsConstructor
@Document(collection = "students")
public class Student {

    @Id
    private String idStudent;
    private String  examnSolutionPath;
    private String email;
    private int currentStep;
    private Long  currentLevelId;

}
