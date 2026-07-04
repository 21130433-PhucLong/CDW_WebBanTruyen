package com.example.comicop.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// @EnableWebSecurity — bật Spring Security
// @EnableMethodSecurity — cho phép dùng @PreAuthorize trên method
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http

                // Bật CORS cho Spring Security
                .cors(cors -> {})

                // Tắt CSRF vì dùng JWT
                .csrf(csrf -> csrf.disable())

                // Cấu hình quyền truy cập
                .authorizeHttpRequests(auth -> auth

                        // Cho phép tất cả request OPTIONS (preflight CORS)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Public API
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/manga/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/authors/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/manga/*/reviews").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/news").permitAll()
                        // Public pages
                        .requestMatchers(
                                "/",
                                "/index",
                                "/manga/**",
                                "/login",
                                "/register"
                        ).permitAll()
                        // Voucher validate — public, không cần đăng nhập
                        .requestMatchers(HttpMethod.GET, "/api/vouchers/validate").permitAll()

                        // Order — cần đăng nhập
                        .requestMatchers("/api/orders/**").authenticated()

                        .requestMatchers(HttpMethod.POST, "/api/auth/avatar").authenticated()

                        .requestMatchers(HttpMethod.GET, "/api/auth/me").authenticated()
                        .requestMatchers("/api/auth/me").authenticated()
                        // Admin only
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        .requestMatchers("/api/addresses/**").authenticated()
                        .requestMatchers("/api/cart/**").authenticated()
                        .requestMatchers("/api/wishlist/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/manga/*/wishlist").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/manga/*/wishlist").authenticated()

                        .anyRequest().authenticated()
                )

                // Không dùng Session, chỉ dùng JWT
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // JWT filter
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // BCryptPasswordEncoder — mã hoá password trước khi lưu DB
    // BCrypt tự thêm "salt" ngẫu nhiên → cùng password nhưng hash khác nhau mỗi lần
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // AuthenticationManager — Spring dùng để xác thực username/password
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}