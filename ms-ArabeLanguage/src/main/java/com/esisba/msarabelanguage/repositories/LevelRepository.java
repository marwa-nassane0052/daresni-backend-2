package com.esisba.msarabelanguage.repositories;

import com.esisba.msarabelanguage.entities.Level;
import com.esisba.msarabelanguage.entities.Linguistic;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
@EnableMongoRepositories
public interface LevelRepository extends MongoRepository<Level,Long> {

    //localhost:7777/arabeLanguage/levels/search/findByName?name=NiveauA
    Level findByNameAndLinguistic(String name , Linguistic linguistic);
    Level findLevelByIdStudentsContaining(String idStudent);
    Level findLevelByIdLevel(Long idLevel);
    List<Level> findByName(String name);

    List<Level> findLevelByLinguistic(Linguistic linguistic);
}

