package org.example.paimentms.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document (collection = "students_accounts")
@Data
@AllArgsConstructor
@NoArgsConstructor



public class StudentAccount {

    @Id
    private String id;
    private String email;
    private String numerocompte;
    private double solde;


}
