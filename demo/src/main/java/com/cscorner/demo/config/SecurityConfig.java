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
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
            // JWT API does not use CSRF
            .csrf(csrf -> csrf.disable())

            // Enable CORS
            .cors(cors ->
                cors.configurationSource(corsConfigurationSource())
            )

            // JWT = stateless
            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            .authorizeHttpRequests(auth -> auth

                // CORS preflight
                .requestMatchers(
                    HttpMethod.OPTIONS,
                    "/**"
                ).permitAll()

                // Login + registration
                .requestMatchers(
                    "/api/auth/**"
                ).permitAll()

                // Public product GET requests
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/products/**"
                ).permitAll()

                // Product creation
                // Keep this public for your current testing
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/products"
                ).permitAll()

                // Everything else requires JWT
                .anyRequest().authenticated()
            )

            // JWT filter
            .addFilterBefore(
                jwtFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
            new CorsConfiguration();

        configuration.setAllowedOrigins(Arrays.asList(

            // Your CURRENT Render frontend
            "https://novacart-frontend-wvbi.onrender.com",

            // Local Angular development
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