package com.example.comicop.config;

import com.example.comicop.repository.AccountRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

// JwtFilter — chạy mỗi request trước khi vào Controller
// Đọc JWT token từ header Authorization
// Nếu token hợp lệ → set thông tin user vào SecurityContext
// SecurityContext = "bộ nhớ tạm" Spring dùng để biết ai đang gọi request
@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final AccountRepository accountRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        // Đọc header Authorization: "Bearer eyJhbGc..."
        final String authHeader = request.getHeader("Authorization");

        // Nếu không có header hoặc không bắt đầu bằng "Bearer " → bỏ qua
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Lấy token (bỏ 7 ký tự "Bearer ")
        final String token = authHeader.substring(7);

        try {
            // Lấy email từ token
            final String email = jwtUtil.extractEmail(token);
            final String role = jwtUtil.extractRole(token);

            // Nếu có email và chưa có authentication trong context
            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // Kiểm tra email có trong DB không
                var account = accountRepository.findByEmail(email);
                if (account != null && jwtUtil.validateToken(token, email)) {
                    // Tạo authentication object với role của user
                    var authToken = new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            List.of(new SimpleGrantedAuthority("ROLE_" + role))
                    );
                    // Set vào SecurityContext → Spring biết request này được xác thực
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Token không hợp lệ → bỏ qua, không set authentication
            // Request sẽ bị từ chối ở SecurityConfig nếu endpoint cần auth
        }

        filterChain.doFilter(request, response);
    }
}