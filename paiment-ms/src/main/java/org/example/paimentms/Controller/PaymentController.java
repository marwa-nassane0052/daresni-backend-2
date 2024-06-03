package org.example.paimentms.Controller;

import org.example.paimentms.Entity.StudentAccount;
import org.example.paimentms.Repository.StudentAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class PaymentController {

    @Autowired
    private StudentAccountRepository studentAccountRepository;

    @PostMapping("/payment")
    @Transactional
    public ResponseEntity<Map<String, Object>> makePayment(@RequestParam String numerocompte, @RequestParam double amount) {
        Map<String, Object> response = new HashMap<>();
        HttpStatus httpStatus;

        if (numerocompte == null || numerocompte.isEmpty() || amount <= 0) {
            response.put("success", false);
            response.put("message", "Veuillez fournir un numéro de compte valide et un montant positif.");
            httpStatus = HttpStatus.BAD_REQUEST;
        } else {
            StudentAccount studentAccount = studentAccountRepository.findByNumerocompte(numerocompte);
            if (studentAccount != null && studentAccount.getSolde() >= amount) {
                double nouveauSolde = studentAccount.getSolde() - amount;
                studentAccount.setSolde(nouveauSolde);
                studentAccountRepository.save(studentAccount); // Mettre à jour le solde dans la base de données

                response.put("success", true);
                response.put("message", "Paiement effectué avec succès! Nouveau solde: " + nouveauSolde);
                httpStatus = HttpStatus.OK;
            } else {
                response.put("success", false);
                response.put("message", "Solde insuffisant pour effectuer le paiement.");
                httpStatus = HttpStatus.BAD_REQUEST;
            }
        }

        return new ResponseEntity<>(response, httpStatus);
    }
}

