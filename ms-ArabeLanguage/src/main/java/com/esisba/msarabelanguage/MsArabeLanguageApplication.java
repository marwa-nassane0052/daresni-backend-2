package com.esisba.msarabelanguage;

import com.esisba.msarabelanguage.entities.Level;
import com.esisba.msarabelanguage.entities.Linguistic;
import com.esisba.msarabelanguage.entities.Step;
import com.esisba.msarabelanguage.repositories.LevelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

import java.util.Arrays;
import java.util.List;

@SpringBootApplication
@EnableFeignClients
public class MsArabeLanguageApplication implements CommandLineRunner {


    @Autowired
    LevelRepository levelRepository;
    public static void main(String[] args) {
        SpringApplication.run(MsArabeLanguageApplication.class, args);
    }


    @Override
    public void run(String... args) throws Exception {

    }
}
