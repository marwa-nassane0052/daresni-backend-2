package org.example.paimentms.Repository;


import org.example.paimentms.Entity.StudentAccount;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StudentAccountRepository extends MongoRepository<StudentAccount, String> {



    StudentAccount findByNumerocompte(String numerocompte);



    }
