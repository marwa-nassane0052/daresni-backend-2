package com.esisba.msarabelanguage.proxies;

import com.esisba.msarabelanguage.models.StudentAuth;
import com.esisba.msarabelanguage.models.StudentAuthInfo;

import org.springframework.cloud.loadbalancer.annotation.LoadBalancerClient;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "AUTH-SERVICE" , url = "http://localhost:3001")
@LoadBalancerClient(name = "AUTH-SERVICE")

public interface StudentProxy {

    @GetMapping("/auth/user")
    StudentAuth getEtudiant(@RequestHeader("Authorization") String token);

    @GetMapping("/auth/getInfoUser")
    StudentAuthInfo getEtudiantInfo(@RequestHeader("Authorization") String token);

}