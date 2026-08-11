package com.cscorner.demo.security;

import com.cscorner.demo.entity.User;
import com.cscorner.demo.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;


    // =========================================================
    // DECIDE WHICH REQUESTS SHOULD SKIP JWT FILTER
    // =========================================================
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {

        String path = request.getServletPath();
        String method = request.getMethod();

        // -----------------------------------------------------
        // Login / Register are public
        // -----------------------------------------------------
        if (path.startsWith("/api/auth/")) {
            return true;
        }

        // -----------------------------------------------------
        // GET /api/products is public
        // -----------------------------------------------------
        if (path.equals("/api/products")
                && method.equalsIgnoreCase("GET")) {

            return true;
        }

        // -----------------------------------------------------
        // GET /api/products/{id} is public
        // -----------------------------------------------------
        if (path.startsWith("/api/products/")
                && method.equalsIgnoreCase("GET")) {

            return true;
        }

        // -----------------------------------------------------
        // CORS preflight is public
        // -----------------------------------------------------
        if (method.equalsIgnoreCase("OPTIONS")) {
            return true;
        }

        // -----------------------------------------------------
        // POST / PUT / DELETE continue through JWT filter
        // -----------------------------------------------------
        return false;
    }


    // =========================================================
    // JWT AUTHENTICATION
    // =========================================================
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // -----------------------------------------------------
        // No Authorization header
        // -----------------------------------------------------
        if (authHeader == null || authHeader.isBlank()) {

            System.out.println(
                    "JWT FILTER: No Authorization header for "
                    + request.getMethod()
                    + " "
                    + request.getServletPath()
            );

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");

            response.getWriter().write(
                    "{\"message\":\"Authorization token is missing\"}"
            );

            return;
        }


        // -----------------------------------------------------
        // Authorization header must start with Bearer
        // -----------------------------------------------------
        if (!authHeader.startsWith("Bearer ")) {

            System.out.println(
                    "JWT FILTER: Invalid Authorization header"
            );

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");

            response.getWriter().write(
                    "{\"message\":\"Invalid Authorization header\"}"
            );

            return;
        }


        // -----------------------------------------------------
        // Extract JWT token
        // -----------------------------------------------------
        String token = authHeader.substring(7).trim();


        if (token.isEmpty()) {

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");

            response.getWriter().write(
                    "{\"message\":\"JWT token is empty\"}"
            );

            return;
        }


        try {

            // -------------------------------------------------
            // Extract email/username from JWT
            // -------------------------------------------------
            String email = jwtUtil.extractUsername(token);

            System.out.println(
                    "JWT FILTER: Email from token = " + email
            );


            if (email == null || email.isBlank()) {

                System.out.println(
                        "JWT FILTER: Could not extract email from token"
                );

                response.setStatus(
                        HttpServletResponse.SC_UNAUTHORIZED
                );

                response.setContentType("application/json");

                response.getWriter().write(
                        "{\"message\":\"Invalid JWT token\"}"
                );

                return;
            }


            // -------------------------------------------------
            // Find user in database
            // -------------------------------------------------
            User user = userRepository
                    .findByEmail(email)
                    .orElse(null);


            if (user == null) {

                System.out.println(
                        "JWT FILTER: User not found for email = "
                        + email
                );

                response.setStatus(
                        HttpServletResponse.SC_UNAUTHORIZED
                );

                response.setContentType("application/json");

                response.getWriter().write(
                        "{\"message\":\"User not found\"}"
                );

                return;
            }


            // -------------------------------------------------
            // Create authenticated user
            // -------------------------------------------------
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            user,
                            null,
                            List.of(
                                    new SimpleGrantedAuthority(
                                            "ROLE_" + user.getRole()
                                    )
                            )
                    );


            // -------------------------------------------------
            // Put authentication into Spring Security context
            // -------------------------------------------------
            SecurityContextHolder
                    .getContext()
                    .setAuthentication(authentication);


            System.out.println(
                    "JWT FILTER: Authentication successful for "
                    + email
            );


            // -------------------------------------------------
            // Continue request
            // -------------------------------------------------
            filterChain.doFilter(request, response);

        } catch (Exception e) {

            System.out.println(
                    "JWT FILTER ERROR: "
                    + e.getMessage()
            );

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            response.setContentType("application/json");

            response.getWriter().write(
                    "{\"message\":\"Invalid or expired JWT token\"}"
            );
        }
    }
}