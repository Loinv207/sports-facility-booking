package com.sportsfacilitybooking.backend;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
public class HomeController {
    @GetMapping("/")
    public String home() {
        return "Hello, Spring Boot is running!";
    }
    
}
