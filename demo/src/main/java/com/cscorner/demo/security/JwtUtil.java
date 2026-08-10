package com.cscorner.demo.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    // IMPORTANT:
    // HS256 requires a key of at least 256 bits = 32 bytes.
    private static final String SECRET =
            "NovaCartSecretKey123456789012345678";

    private final SecretKey secretKey =
            Keys.hmacShaKeyFor(
                    SECRET.getBytes(StandardCharsets.UTF_8)
            );

    // =========================
    // GENERATE JWT TOKEN
    // =========================
    public String generateToken(String email) {

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(
                                System.currentTimeMillis()
                                        + 1000L * 60 * 60
                        )
                )
                .signWith(
                        secretKey,
                        SignatureAlgorithm.HS256
                )
                .compact();
    }

    // =========================
    // EXTRACT USERNAME / EMAIL
    // =========================
    public String extractUsername(String token) {

        Claims claims =
                Jwts.parser()
                        .setSigningKey(secretKey)
                        .parseClaimsJws(token)
                        .getBody();

        return claims.getSubject();
    }

    // =========================
    // VALIDATE TOKEN
    // =========================
    public boolean validateToken(
            String token,
            String email) {

        try {

            String extractedEmail =
                    extractUsername(token);

            return extractedEmail.equals(email);

        } catch (Exception e) {

            return false;
        }
    }
}