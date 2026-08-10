package com.cscorner.demo.controller;

import com.cscorner.demo.dto.AuthResponse;
import com.cscorner.demo.dto.LoginRequest;
import com.cscorner.demo.dto.RegisterRequest;
import com.cscorner.demo.entity.User;
import com.cscorner.demo.security.JwtUtil;
import com.cscorner.demo.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(
        origins = {
                "http://localhost:4200",
                "http://localhost:53712",
                "https://my-angular-tutorial-production-4383.up.railway.app"
        }
)
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;


    // =========================
    // REGISTER
    // =========================

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request) {

        try {

            User user = new User();

            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setPassword(request.getPassword());
            user.setRole("SELLER");

            User savedUser =
                    userService.register(user);

            String token =
                    jwtUtil.generateToken(
                            savedUser.getEmail()
                    );

            return ResponseEntity.ok(
                    new AuthResponse(
                            "Registration Successful",
                            token
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            new ErrorResponse(
                                    e.getMessage()
                            )
                    );
        }
    }


    // =========================
    // LOGIN
    // =========================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        try {

            User user =
                    userService.login(
                            request.getEmail(),
                            request.getPassword()
                    );

            String token =
                    jwtUtil.generateToken(
                            user.getEmail()
                    );

            return ResponseEntity.ok(
                    new AuthResponse(
                            "Login Successful",
                            token
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            new ErrorResponse(
                                    e.getMessage()
                            )
                    );
        }
    }


    // =========================
    // ERROR RESPONSE
    // =========================

    public static class ErrorResponse {

        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}