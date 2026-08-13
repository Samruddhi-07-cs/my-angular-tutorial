package com.cscorner.demo.service;

import com.cscorner.demo.entity.User;
import com.cscorner.demo.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    // =========================================================
    // REGISTER
    // =========================================================

    public User register(User user) {

        String email =
                user.getEmail()
                    .trim()
                    .toLowerCase();


        // -----------------------------------------------------
        // CHECK EMAIL
        // -----------------------------------------------------

        if (repository.findByEmail(email).isPresent()) {

            throw new RuntimeException(
                "Email already exists"
            );
        }


        // -----------------------------------------------------
        // SAVE NORMALIZED EMAIL
        // -----------------------------------------------------

        user.setEmail(email);


        // -----------------------------------------------------
        // ENCODE PASSWORD
        // -----------------------------------------------------

        user.setPassword(
            passwordEncoder.encode(
                user.getPassword()
            )
        );


        // -----------------------------------------------------
        // DEFAULT ROLE
        // -----------------------------------------------------

        if (user.getRole() == null
                || user.getRole().isEmpty()) {

            user.setRole("SELLER");
        }


        // -----------------------------------------------------
        // SAVE USER
        // -----------------------------------------------------

        return repository.save(user);
    }


    // =========================================================
    // LOGIN
    // =========================================================

    public User login(
            String email,
            String password) {

        String normalizedEmail =
                email.trim().toLowerCase();


        User user =
                repository
                    .findByEmail(normalizedEmail)
                    .orElseThrow(
                        () -> new RuntimeException(
                            "User not found"
                        )
                    );


        // -----------------------------------------------------
        // CHECK PASSWORD
        // -----------------------------------------------------

        if (!passwordEncoder.matches(
                password,
                user.getPassword())) {

            throw new RuntimeException(
                "Invalid Password"
            );
        }


        return user;
    }
}