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

            // Disable CSRF because this is a JWT REST API
            .csrf(csrf -> csrf.disable())

            // Enable CORS
            .cors(cors ->
                cors.configurationSource(corsConfigurationSource())
            )

            // No HTTP session
            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            // API authorization
            .authorizeHttpRequests(auth -> auth

                // CORS preflight
                .requestMatchers(
                    HttpMethod.OPTIONS,
                    "/**"
                ).permitAll()

                // Login and registration are public
                .requestMatchers(
                    "/api/auth/**"
                ).permitAll()

                // GET products are public
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/products/**"
                ).permitAll()

                // TEMPORARY: allow POST products for testing
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/products"
                ).permitAll()

                // PUT and DELETE still require JWT
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

            "https://my-angular-tutorial-production-4383.up.railway.app",

            "https://my-angular-tutorial-production-f731.up.railway.app",

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