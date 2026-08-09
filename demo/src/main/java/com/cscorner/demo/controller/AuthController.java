package com.cscorner.demo.controller;

import com.cscorner.demo.dto.AuthResponse;
import com.cscorner.demo.dto.LoginRequest;
import com.cscorner.demo.dto.RegisterRequest;
import com.cscorner.demo.entity.User;
import com.cscorner.demo.security.JwtUtil;
import com.cscorner.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole("SELLER");

        userService.register(user);

        String token = jwtUtil.generateToken(user.getEmail());

        return new AuthResponse(
                "Registration Successful",
                token
        );
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {

        User user = userService.login(
                request.getEmail(),
                request.getPassword()
        );

        String token = jwtUtil.generateToken(user.getEmail());

        return new AuthResponse(
                "Login Successful",
                token
        );
    }
}