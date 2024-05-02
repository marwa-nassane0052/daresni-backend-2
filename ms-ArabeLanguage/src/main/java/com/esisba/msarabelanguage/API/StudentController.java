package com.esisba.msarabelanguage.API;

import com.esisba.msarabelanguage.DTO.FormDTO;
import com.esisba.msarabelanguage.DTO.Level.DetailLevelStudentDTO;
import com.esisba.msarabelanguage.entities.Level;
import com.esisba.msarabelanguage.entities.Step;
import com.esisba.msarabelanguage.entities.Student;
import com.esisba.msarabelanguage.models.StudentAuth;
import com.esisba.msarabelanguage.proxies.StudentProxy;
import com.esisba.msarabelanguage.repositories.LevelRepository;
import com.esisba.msarabelanguage.repositories.StudentRepository;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("student")
public class StudentController {

    @Autowired
    LevelRepository levelRepository;

    @Resource
    StudentProxy studentProxy;

    @Autowired
    StudentRepository studentRepository;

    /************************************************** Student **************************************************************/

    //1 verify if student is already sign in level
    @GetMapping("/isStudentIAL")
    Boolean isStudentIAL(@RequestHeader("Authorization") String token) {
        StudentAuth studentAuth = studentProxy.getEtudiant(token);
        return studentRepository.existsById(studentAuth.getId());

    }


    //2  inscription of student in level
    @PostMapping("/inscription")
    Student ArabeInscription(@RequestBody FormDTO formDTO, @RequestHeader("Authorization") String token) {

        StudentAuth studentAuth = studentProxy.getEtudiant(token);
        Level level = levelRepository.findByNameAndLinguistic(formDTO.getLevel(), formDTO.getLinguistic());
        Student student = new Student();
        student.setIdStudent(studentAuth.getId());
        student.setEmail(studentAuth.getEmail());
        student.setCurrentLevelId(level.getIdLevel());
        student.setCurrentStep(1);
        studentRepository.save(student);
        List<String> idStudents = level.getIdStudents();
        if (idStudents == null) {
            idStudents = new ArrayList<>(); // Initialize idStudents if it is null
        }
        idStudents.add(studentAuth.getId());
        level.setIdStudents(idStudents);
        levelRepository.save(level);
        return student;
    }

    //3  get information about student logged (login)
    @GetMapping("/studentInfo")
    Student getStudentLevel(@RequestHeader("Authorization") String token) {
        StudentAuth studentAuth = studentProxy.getEtudiant(token);
        return studentRepository.findByIdStudent(studentAuth.getId());
    }

    //4  get detail of a Level by id to a student

    @GetMapping("/levels/{id}")
    DetailLevelStudentDTO getDetailLevelStudent(@PathVariable("id") Long id, @RequestHeader("Authorization") String token) {
        StudentAuth studentAuth = studentProxy.getEtudiant(token);
        Level level = levelRepository.findLevelByIdLevel(id);
        DetailLevelStudentDTO detailLevel = new DetailLevelStudentDTO();
        detailLevel.setId(id);
        detailLevel.setName(level.getName());
        detailLevel.setLinguistic(level.getLinguistic());
        detailLevel.setSteps(level.getSteps());
        detailLevel.setExamn(level.getExamnPath());
        detailLevel.setCurrentStep(studentRepository.findByIdStudent(studentAuth.getId()).getCurrentStep());
        return detailLevel;

    }
    //5 get Step by index

    @GetMapping("/levels/{levelId}/{indexStep}")
    ResponseEntity<Step> getStudentStep(@RequestHeader("Authorization") String token, @PathVariable("indexStep") int indexStep , @PathVariable("levelId") Long levelId) {
        StudentAuth studentAuth = studentProxy.getEtudiant(token);
        Student student = studentRepository.findByIdStudent(studentAuth.getId());
        if (indexStep <= student.getCurrentStep()) {
            Level level = levelRepository.findLevelByIdLevel(levelId);
            return ResponseEntity.ok(level.getSteps().get(indexStep-1));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED ).build();

    }


    //6 upgrade step when he click on next
    @PostMapping("/{indexStep}/upgradeStep")
    ResponseEntity<String> upgradeStep(@RequestHeader("Authorization") String token, @PathVariable("indexStep") int indexStep) {
        try {
            Student student = studentRepository.findByIdStudent(studentProxy.getEtudiant(token).getId());
            int currentEtape = student.getCurrentStep();
            if (currentEtape == indexStep) {
                student.setCurrentStep(currentEtape+1);
                studentRepository.save(student);
                return ResponseEntity.status(HttpStatus.OK).body("Upgrade successful");
            } else {
                return ResponseEntity.ok("already upgraded");
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }

    }

    //7 in LevelRepository


    //8  download exam of level
    @GetMapping("/levels/{levelId}/downlaodExam")
    String downloadedExam(@RequestHeader("Authorization") String token, @PathVariable("levelId") Long levelId) {
        Level level = levelRepository.findLevelByIdLevel(levelId);
        if(level.getExamnPath() != null) {
            return level.getExamnPath();
        }else {
            return "No exam found";
        }
    }

    //9  upload examSolution
    @PostMapping("/uploadExamSolution")
    ResponseEntity<String> uploadExamSolution(@RequestHeader("Authorization") String token , @RequestBody String examPath) {
        Student student = studentRepository.findByIdStudent(studentProxy.getEtudiant(token).getId());
        student.setExamnSolutionPath(examPath);
        studentRepository.save(student);
        return ResponseEntity.ok("uploaded Successfully");
    }


}