package com.example.comicop.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

// CorsConfig — cho phép frontend gọi API backend
// CORS = Cross-Origin Resource Sharing
// Frontend chạy port 3000, Backend port 8080 → khác origin → bị chặn
// CorsConfig này mở cho phép frontend gọi được
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // Cho phép frontend localhost:3000 gọi API
        config.addAllowedOrigin("http://localhost:3000");

        // Cho phép tất cả HTTP methods
        config.addAllowedMethod("*");

        // Cho phép tất cả headers kể cả Authorization (JWT)
        config.addAllowedHeader("*");

        // Cho phép gửi credentials (cookie, Authorization header)
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Áp dụng config này cho tất cả endpoint /**
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}