package com.cscorner.demo.config;

import com.cscorner.demo.security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

            // =====================================================
            // DISABLE CSRF
            // JWT REST API does not use session-based CSRF
            // =====================================================
            .csrf(csrf -> csrf.disable())

            // =====================================================
            // ENABLE CORS
            // =====================================================
            .cors(cors ->
                cors.configurationSource(corsConfigurationSource())
            )

            // =====================================================
            // STATELESS SESSION
            // =====================================================
            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            // =====================================================
            // AUTHORIZATION RULES
            // =====================================================
            .authorizeHttpRequests(auth -> auth

                // -------------------------------------------------
                // Root endpoint
                // -------------------------------------------------
                .requestMatchers("/")
                .permitAll()

                // -------------------------------------------------
                // CORS preflight
                // -------------------------------------------------
                .requestMatchers(
                    HttpMethod.OPTIONS,
                    "/**"
                )
                .permitAll()

                // -------------------------------------------------
                // Login and Registration
                // -------------------------------------------------
                .requestMatchers(
                    "/api/auth/**"
                )
                .permitAll()

                // -------------------------------------------------
                // Public GET products
                // -------------------------------------------------
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/products/**"
                )
                .permitAll()

                // -------------------------------------------------
                // Add product requires JWT
                // -------------------------------------------------
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/products"
                )
                .authenticated()

                // -------------------------------------------------
                // Update product requires JWT
                // -------------------------------------------------
                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/products/**"
                )
                .authenticated()

                // -------------------------------------------------
                // Delete product requires JWT
                // -------------------------------------------------
                .requestMatchers(
                    HttpMethod.DELETE,
                    "/api/products/**"
                )
                .authenticated()

                // -------------------------------------------------
                // Everything else requires authentication
                // -------------------------------------------------
                .anyRequest()
                .authenticated()
            )

            // =====================================================
            // JWT FILTER
            // =====================================================
            .addFilterBefore(
                jwtFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }


    // =============================================================
    // CORS CONFIGURATION
    // =============================================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
            new CorsConfiguration();

        configuration.setAllowedOrigins(Arrays.asList(

            // -----------------------------------------------------
            // YOUR CURRENT RENDER FRONTEND
            // -----------------------------------------------------
            "https://novacart-frontend-wvbi.onrender.com",

            // -----------------------------------------------------
            // LOCAL ANGULAR DEVELOPMENT
            // -----------------------------------------------------
            "http://localhost:4200",
            "http://localhost:4201"
        ));

        configuration.setAllowedMethods(Arrays.asList(
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "OPTIONS"
        ));

        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "Accept",
            "Origin",
            "X-Requested-With"
        ));

        configuration.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
            "/**",
            configuration
        );

        return source;
    }
}