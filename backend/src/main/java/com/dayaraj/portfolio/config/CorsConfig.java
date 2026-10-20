package com.dayaraj.portfolio.config;

import java.util.Arrays;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    private final String[] origins;

    public CorsConfig(@Value("${app.cors.allowed-origins}") String allowed) {
        this.origins = Arrays.stream(allowed.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty() && !s.equals("*"))
                .toArray(String[]::new);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/contact")
                .allowedOrigins(origins)
                .allowedMethods("POST", "OPTIONS")
                .allowedHeaders("Content-Type")
                .allowCredentials(false)
                .maxAge(3600);
        registry.addMapping("/api/health")
                .allowedOrigins(origins)
                .allowedMethods("GET", "OPTIONS")
                .allowCredentials(false);
    }
}
