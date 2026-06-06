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

        // Local development
        config.addAllowedOrigin("http://localhost:3000");

        // ← Thêm link Vercel thật của bạn vào đây
        config.addAllowedOrigin("https://comicop.vercel.app");

        config.addAllowedMethod("*");
        config.addAllowedHeader("*");
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}