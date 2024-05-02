package com.esisba.msarabelanguage.entities;

import org.springframework.data.rest.core.config.Projection;

@Projection(name = "pr1" , types = Level.class)
public interface LevelProjection {


    public String getName();
    public String getLinguistic();
    public String getExamn();


}
