package com.esisba.msarabelanguage.repositories;

import com.esisba.msarabelanguage.entities.Student;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@EnableMongoRepositories
public interface StudentRepository extends MongoRepository<Student, String> {

    Student findByIdStudent(String id);
    List<Student> findStudentByCurrentLevelId(Long levelId);

}
