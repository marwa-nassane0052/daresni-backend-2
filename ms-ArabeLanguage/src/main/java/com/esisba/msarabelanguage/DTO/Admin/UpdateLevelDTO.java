package com.esisba.msarabelanguage.DTO.Admin;

import com.esisba.msarabelanguage.entities.Class.Step;

import lombok.Data;

import java.util.List;

@Data
public class UpdateLevelDTO {

    private String name;
    private List<Step> steps;
    private String examnPath;
}
