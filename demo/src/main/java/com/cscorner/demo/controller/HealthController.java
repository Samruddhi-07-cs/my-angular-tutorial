package com.cscorner.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/api/health")
    public String health() {
        return "NovaCart API is healthy!";
    }

    @GetMapping("/")
    public String home() {
        return "NovaCart API is running!";
    }
}