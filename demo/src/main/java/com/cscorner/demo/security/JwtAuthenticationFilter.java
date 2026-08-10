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

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {

        String path = request.getServletPath();
        String method = request.getMethod();

        // Public authentication APIs
        if (path.startsWith("/api/auth/")) {
            return true;
        }

        // Public GET product APIs
        if (path.equals("/api/products")
                && method.equalsIgnoreCase("GET")) {
            return true;
        }

        if (path.startsWith("/api/products/")
                && method.equalsIgnoreCase("GET")) {
            return true;
        }

        // CORS preflight request
        if (method.equalsIgnoreCase("OPTIONS")) {
            return true;
        }

        // POST, PUT and DELETE must pass through JWT authentication
        return false;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            String token = authHeader.substring(7);

            try {

                String email = jwtUtil.extractUsername(token);

                User user = userRepository
                        .findByEmail(email)
                        .orElse(null);

                if (user != null) {

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

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(authentication);
                }

            } catch (Exception e) {
                // Invalid or expired JWT token.
                // Spring Security will handle the unauthenticated request.
            }
        }

        filterChain.doFilter(request, response);
    }
}