package com.esisba.msarabelanguage.API;

import com.esisba.msarabelanguage.DTO.StepDTO;
import com.esisba.msarabelanguage.DTO.Student.DetailLevelStudentDTO;
import com.esisba.msarabelanguage.entities.Class.*;
import com.esisba.msarabelanguage.models.StudentAuth;
import com.esisba.msarabelanguage.proxies.StudentProxy;
import com.esisba.msarabelanguage.repositories.LanguageRepository;
import com.esisba.msarabelanguage.repositories.StudentRepository;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;



@RestController
@RequestMapping("student")
public class StudentController {


    @Autowired
    LanguageRepository languageRepository;

    @Resource
    StudentProxy studentProxy;

    @Autowired
    StudentRepository studentRepository;

    /************************************************** Student **************************************************************/


    //1 verify if student exist
    @GetMapping("/isStudentIAL")
    Boolean isStudentIAL(@RequestHeader("Authorization") String token) {
        StudentAuth studentAuth = studentProxy.getEtudiant(token);
        return studentRepository.existsById(studentAuth.getId());

    }


    //2  inscription of student in language level (learn)
    @PostMapping("/{idLang}/inscription")
    ResponseEntity<?> ArabeInscription( @PathVariable("idLang") String idLang,@RequestHeader("Authorization") String token) {
        Student student;

        StudentAuth studentAuth = studentProxy.getEtudiant(token);
        Language language = languageRepository.findByIdLang(idLang);

        List<StudentInfo> studentInfos = language.getStudentInfos();

        if (studentInfos == null ) {
            studentInfos = new ArrayList<>();
        }

        Optional<StudentInfo> StudentInfoOp = studentInfos.stream()
                .filter(idStudentAndExamexist -> idStudentAndExamexist.getIdStudent().equalsIgnoreCase(studentAuth.getId()))
                .findFirst();


        if (StudentInfoOp.isPresent()) {

            StudentInfo StudentInfo = StudentInfoOp.get();
            int CurrentLevel = StudentInfo.getCurrentLevel();
            Level level = language.getLevels().get(CurrentLevel);

            DetailLevelStudentDTO detailLevelStudentDTO = new DetailLevelStudentDTO();
            detailLevelStudentDTO.setLevel(level);
            detailLevelStudentDTO.setCurrentStep(StudentInfo.getCurrentStep());
            return ResponseEntity.ok(detailLevelStudentDTO);

        } else {
            if (!studentRepository.existsById(studentAuth.getId())) {
                student = new Student();
                student.setIdStudent(studentAuth.getId());
                student.setEmail(studentAuth.getEmail());
                studentRepository.save(student);
            }


            studentInfos.add(new StudentInfo(studentAuth.getId(),null, 0,0));
            language.setStudentInfos(studentInfos);
            languageRepository.save(language);

            Level level = language.getLevels().get(0);

            DetailLevelStudentDTO detailLevelStudentDTO = new DetailLevelStudentDTO();
            detailLevelStudentDTO.setLevel(level);
            detailLevelStudentDTO.setCurrentStep(0);
            return ResponseEntity.ok(detailLevelStudentDTO);

        }
    }

    //3 next Step
    @PostMapping("/{langId}/{indexStep}/upgradeStep")
    public ResponseEntity<?> upgradeStep(@RequestHeader("Authorization") String token, @PathVariable("indexStep") int indexStep, @PathVariable("langId") String langId) {
        try {
            Language language = languageRepository.findByIdLang(langId);
            if (language == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Language not found");
            }

            StudentAuth studentAuth = studentProxy.getEtudiant(token);
            List<StudentInfo> studentInfos = language.getStudentInfos();

            if (studentInfos == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student info list not found");
            }

            Optional<StudentInfo> studentInfoOp = studentInfos.stream()
                    .filter(info -> info.getIdStudent().equalsIgnoreCase(studentAuth.getId()))
                    .findFirst();

            if (!studentInfoOp.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found");
            }

            StudentInfo studentInfo = studentInfoOp.get();
            int currentStep = studentInfo.getCurrentStep();
            int currentLevel = studentInfo.getCurrentLevel();

            Level level = language.getLevels().get(currentLevel);

            List<Step> steps = level.getSteps();

            if (indexStep  >= steps.size()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Step index out of bounds");
            }

            StepDTO stepDTO = new StepDTO();
            if (currentStep == indexStep) {
                if (currentStep + 1 >= steps.size()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("This is the final step, upload the exam");
                }
                studentInfo.setCurrentStep(currentStep + 1);
                int index = studentInfos.indexOf(studentInfo);
                studentInfos.set(index, studentInfo);  // Update the existing entry
                language.setStudentInfos(studentInfos);
                languageRepository.save(language);

                stepDTO.setTitle(steps.get(currentStep + 1).getTitle());
                stepDTO.setContent(steps.get(currentStep + 1).getContent());

            } else {
                if (indexStep < currentStep) {
                    stepDTO.setTitle(steps.get(indexStep + 1).getTitle());
                    stepDTO.setContent(steps.get(indexStep + 1).getContent());
                } else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You haven't completed the previous step");
                }
            }

            return ResponseEntity.ok(stepDTO);

        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }


    //4 upload examSolution
    @PostMapping("/{idLang}/uploadExamSolution")
    ResponseEntity<String> uploadExamSolution(@RequestHeader("Authorization") String token, @PathVariable("idLang") String idLang, @RequestParam String examSolutionPath) {
        try {
            Student student = studentRepository.findByIdStudent(studentProxy.getEtudiant(token).getId());
            if (student == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found");
            }

            Language language = languageRepository.findByIdLang(idLang);
            if (language == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Language not found");
            }
            List<StudentInfo> studentInfos = language.getStudentInfos();

            if(studentInfos == null){
                studentInfos = new ArrayList<>();
            }

            Optional<StudentInfo> idStudentAndExamSolutionsOp = studentInfos.stream()
                    .filter(idStudentAndExamexist -> idStudentAndExamexist.getIdStudent().equalsIgnoreCase(student.getIdStudent()))
                    .findFirst();

            if (!idStudentAndExamSolutionsOp.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("You can upload exam solution , just if you learn this laguage");
            }

            StudentInfo studentInfo = idStudentAndExamSolutionsOp.get();
            studentInfo.setExamSolutionPath(examSolutionPath);
            int index = language.getStudentInfos().indexOf(studentInfo);
            language.getStudentInfos().set(index, studentInfo); // Replace the old entry with the updated one
            languageRepository.save(language);

            return ResponseEntity.ok("Uploaded successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while uploading the exam solution: " + e.getMessage());
        }
    }


    //5 download exam of level
    @GetMapping("/{langId}/downloadExam")
    ResponseEntity<String> downloadedExam(@RequestHeader("Authorization") String token, @PathVariable("langId") String langId) {

        Student student = studentRepository.findByIdStudent(studentProxy.getEtudiant(token).getId());
        Language language = languageRepository.findByIdLang(langId);

        if (language == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Language not found");
        }

        StudentAuth studentAuth = studentProxy.getEtudiant(token);
        List<StudentInfo> studentInfos = language.getStudentInfos();

        if (studentInfos == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student info list not found");
        }

        Optional<StudentInfo> studentInfoOp = studentInfos.stream()
                .filter(idStudentAndExamexist -> idStudentAndExamexist.getIdStudent().equalsIgnoreCase(studentAuth.getId()))
                .findFirst();

        if (!studentInfoOp.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found");
        }
        StudentInfo studentInfo = studentInfoOp.get();
        int currentStep = studentInfo.getCurrentStep();
        int currentLevel = studentInfo.getCurrentLevel();

        Level level = language.getLevels().get(currentLevel);
        if (currentStep + 1 == level.getSteps().size()) {
            if (level.getExamnPath() != null) {
                return ResponseEntity.status(HttpStatus.OK).body(level.getExamnPath());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No exam found");
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You can download the exam once you have completed all the steps !");
        }

    }


    //6  get all information about student logged
    @GetMapping("/studentInfo")
    Student getStudentLevel(@RequestHeader("Authorization") String token) {
        StudentAuth studentAuth = studentProxy.getEtudiant(token);
        return studentRepository.findByIdStudent(studentAuth.getId());
    }


}



