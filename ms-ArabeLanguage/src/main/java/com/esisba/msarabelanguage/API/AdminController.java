package com.esisba.msarabelanguage.API;

import com.esisba.msarabelanguage.DTO.Level.DetailLevelAdminDTO;
import com.esisba.msarabelanguage.DTO.Level.ListLevelsDTO;
import com.esisba.msarabelanguage.DTO.StepDTO;
import com.esisba.msarabelanguage.entities.Level;
import com.esisba.msarabelanguage.entities.Linguistic;
import com.esisba.msarabelanguage.entities.Step;
import com.esisba.msarabelanguage.entities.Student;
import com.esisba.msarabelanguage.proxies.StudentProxy;
import com.esisba.msarabelanguage.repositories.LevelRepository;
import com.esisba.msarabelanguage.repositories.StudentRepository;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("admin")
public class AdminController {

    @Autowired
    LevelRepository levelRepository;


    @Resource
    StudentProxy studentProxy;

    @Autowired
    StudentRepository studentRepository;



/************************************************** Admin **************************************************************/


    //1-a  get List of students by levelId -> in StudentsRepository
    //1-b  get List of students by linguistic
    @GetMapping("/students/{linguistic}")
    List<Student> getStudents(@PathVariable("linguistic") Linguistic linguistic) {
        List<Student> students = new ArrayList<>();
        List<Level> levels = levelRepository.findLevelByLinguistic(linguistic);
        for( Level level : levels) {
            for(String idStudent : level.getIdStudents()){
                students.add( studentRepository.findByIdStudent(idStudent));
            }
        }
        return students;
    }

    //1-c get All students -> /students


    //2 upgrade level of student
    @PostMapping("/students/{idStudent}/upgradeLevel")
    ResponseEntity<String> upgradeLevel(@PathVariable("idStudent") String idStudent) {
        Student student = studentRepository.findByIdStudent(idStudent);
        Long currentLevelId= student.getCurrentLevelId();
        //remove student from current level
        Level level = levelRepository.findLevelByIdLevel(currentLevelId);
        List<String> idStudents =level.getIdStudents();
        idStudents.remove(idStudent);
        levelRepository.save(level);

        // add student to next level
        Level levelUpgrade = levelRepository.findLevelByIdLevel(currentLevelId+1L);
        List<String> idStudentsUpgraded =levelUpgrade.getIdStudents();
        idStudentsUpgraded.add(idStudent);
        levelRepository.save(levelUpgrade);

        //upgrade currentLevel in student entity
        student.setCurrentLevelId(currentLevelId+1L);
        student.setCurrentStep(1);
        studentRepository.save(student);

        return ResponseEntity.ok("Level upgraded Successfully");
    }


    //3 get List Of Levels  -> or with all fields in LevelRepository
    @GetMapping("/levels/all")
    List<ListLevelsDTO> getlevels() {
        List<ListLevelsDTO> levelDTOs = new ArrayList<>();
        List<Level> levels = levelRepository.findAll();
        for (Level level : levels) {
            ListLevelsDTO levelDTO = new ListLevelsDTO();
            levelDTO.setName(level.getName());
            levelDTO.setId(level.getIdLevel());
            levelDTO.setLinguistic(level.getLinguistic());
            levelDTOs.add(levelDTO);
        }
        return levelDTOs;
    }

    //3-a get List Of Levels by name -> or with all fields in LevelRepository
    @GetMapping("/levels/levelName")
    List<ListLevelsDTO> getlevelsByName(@RequestParam("levelName") String levelName ) {
        List<ListLevelsDTO> levelDTOs = new ArrayList<>();
        List<Level> levels = levelRepository.findByName(levelName);
        for (Level level : levels) {
            ListLevelsDTO levelDTO = new ListLevelsDTO();
            levelDTO.setName(level.getName());
            levelDTO.setId(level.getIdLevel());
            levelDTO.setLinguistic(level.getLinguistic());
            levelDTOs.add(levelDTO);
        }
        return levelDTOs;
    }
    //3-b get List Of Levels by Linguistic -> LevelRepository
    @GetMapping("/levels/linguistic")
        List<ListLevelsDTO> getlevelsByLinguistic(@RequestParam("linguistic") Linguistic linguistic ) {
        List<ListLevelsDTO> levelDTOs = new ArrayList<>();
        List<Level> levels = levelRepository.findLevelByLinguistic(linguistic);
        for (Level level : levels) {
            ListLevelsDTO levelDTO = new ListLevelsDTO();
            levelDTO.setName(level.getName());
            levelDTO.setId(level.getIdLevel());
            levelDTO.setLinguistic(level.getLinguistic());
            levelDTOs.add(levelDTO);
        }
        return levelDTOs;
    }
    //3-c get List Of Levels by name and Linguistic -> LevelRepository
    @GetMapping("/levels/linguisticANDname")
    ListLevelsDTO getlevelsByNameAndLinguistic(@RequestParam("linguistic") Linguistic linguistic , @RequestParam("levelName") String levelName) {
        ListLevelsDTO levelDTO = new ListLevelsDTO();
        Level level = levelRepository.findByNameAndLinguistic(levelName,linguistic);
        levelDTO.setName(level.getName());
        levelDTO.setId(level.getIdLevel());
        levelDTO.setLinguistic(level.getLinguistic());
        return levelDTO;
    }


    //4 get Detail of Level to Admin
    @GetMapping("/levels/{levelId}")
    DetailLevelAdminDTO getlevels(@PathVariable("levelId") Long levelId) {
        List<Student> students = new ArrayList<>();
        DetailLevelAdminDTO levelDTO = new DetailLevelAdminDTO();
        Level level = levelRepository.findLevelByIdLevel(levelId);
        levelDTO.setName(level.getName());
        levelDTO.setId(level.getIdLevel());
        levelDTO.setExamn(level.getExamnPath());
        levelDTO.setLinguistic(level.getLinguistic());
        levelDTO.setSteps(level.getSteps());
        return levelDTO;
    }

    //5  upload exam
    @PostMapping("/levels/{levelId}/uploadExam")
    ResponseEntity<String> uploadExam(@PathVariable("levelId") Long levelId , @RequestBody String examPath) {
        Level level = levelRepository.findLevelByIdLevel(levelId);
        level.setExamnPath(examPath);
        levelRepository.save(level);
        return ResponseEntity.ok("uploaded Successfully");
    }

    //6  get Step by index
    @GetMapping("/levels/{levelId}/{stepId}")
    Step getStep(@PathVariable("levelId") Long levelId , @PathVariable("stepId") int stepId) {
        Level level = levelRepository.findLevelByIdLevel(levelId);
        Step step = level.getSteps().get(stepId-1);
        return step;
    }


    //7 update Step of a Level
    @PutMapping("/levels/{levelId}/{stepIndex}/update")
    Step updateStep(@PathVariable("levelId") Long levelId, @PathVariable("stepIndex") int stepIndex, @RequestBody StepDTO stepDTO) {
        Level level = levelRepository.findLevelByIdLevel(levelId);
        List<Step> steps = level.getSteps();

        if (stepIndex >= 0 && stepIndex < steps.size()) {
            Step step = steps.get(stepIndex-1);
            // Update the fields of the Step object
            step.setTitle(stepDTO.getTitle());
            step.setRule(stepDTO.getRule());
            step.setDescription(stepDTO.getDescription());
            step.setExemples(stepDTO.getExemples());
            step.setQuestion(stepDTO.getQuestion());
            step.setAnswer(stepDTO.getAnswer());

            // Save the updated step back to the list
            steps.set(stepIndex-1, step);

            // Update the steps list in the level object
            level.setSteps(steps);

            // Save the updated level back to the repository
            levelRepository.save(level);

            return step;
        } else {
            throw new IllegalArgumentException("Invalid step index");
        }
    }

    @PatchMapping("/levels/{levelId}/{stepIndex}/update")
    Step patchStep(@PathVariable("levelId") Long levelId, @PathVariable("stepIndex") int stepIndex, @RequestBody Map<String, Object> updates) {
        Level level = levelRepository.findLevelByIdLevel(levelId);
        List<Step> steps = level.getSteps();

        if (stepIndex >= 0 && stepIndex < steps.size()) {
            Step step = steps.get(stepIndex);

            // Apply updates from the request body
            updates.forEach((key, value) -> {
                switch (key) {
                    case "title":
                        step.setTitle((String) value);
                        break;
                    case "rule":
                        step.setRule((String) value);
                        break;
                    case "description":
                        step.setDescription((String) value);
                        break;
                    case "exemples":
                        step.setExemples((List<String>) value);
                        break;
                    case "question":
                        step.setQuestion((String) value);
                        break;
                    case "answer":
                        step.setAnswer((String) value);
                        break;
                    default:
                        // Handle unknown fields or ignore them
                        break;
                }
            });

            // Save the updated step back to the list
            steps.set(stepIndex, step);

            // Update the steps list in the level object
            level.setSteps(steps);

            // Save the updated level back to the repository
            levelRepository.save(level);

            return step;
        } else {
            throw new IllegalArgumentException("Invalid step index");
        }
    }

    //8  download examSolution
    @GetMapping("/levels/{levelId}/{studentId}/downlaodExamSolution")
    String downloadedExamSolution(@PathVariable("levelId") Long levelId, @PathVariable("studentId") String studentId) {
        Student student = studentRepository.findByIdStudent(studentId);
        String examSolution = student.getExamnSolutionPath();
        if(examSolution != null) {
            return examSolution;
        }else {
            return "No examSolution found";
        }
    }

}
