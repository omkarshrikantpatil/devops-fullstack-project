package com.taxko.ca.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**") // Allow all endpoints
        .allowedOrigins("*") // Allow all origins
            .allowedOriginPatterns("*") // IMPORTANT
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
        .allowedMethods("*") // Allow all HTTP methods (GET, POST, PUT, DELETE, OPTIONS, etc.)
        .allowedHeaders("*") // Allow all headers
        .allowCredentials(false); // Disallow credentials for full public access
  }
}
