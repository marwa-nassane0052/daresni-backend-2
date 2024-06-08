package com.esisba.msarabelanguage.DTO.Admin;

import com.esisba.msarabelanguage.entities.Class.FileData;
import com.esisba.msarabelanguage.entities.Enum.LanguageEnum;
import com.esisba.msarabelanguage.entities.Enum.Linguistic;
import com.esisba.msarabelanguage.entities.Class.Step;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.nio.channels.MulticastChannel;
import java.util.List;

//for admin
@Data
public class DetailLevelAdminDTO {

    private String name;
    private Linguistic linguistic;
    private LanguageEnum language;
    private List<Step> steps;
    private String examnPath;
}

