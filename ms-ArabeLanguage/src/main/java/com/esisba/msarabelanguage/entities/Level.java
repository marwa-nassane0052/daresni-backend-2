package com.esisba.msarabelanguage.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Document(collection = "Niveaux" )
@Data @AllArgsConstructor @NoArgsConstructor
public class Level {

    @Id
    private Long idLevel;
    private String name;
    private Linguistic linguistic;
    private List<Step> steps;
    private String examnPath;
    private List<String> idStudents;


}
