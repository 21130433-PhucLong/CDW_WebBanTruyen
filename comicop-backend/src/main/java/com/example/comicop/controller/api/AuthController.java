package com.example.comicop.controller.api;

import com.example.comicop.dto.AccountDto;
import com.example.comicop.dto.AuthRequest;
import com.example.comicop.dto.AuthResponse;
import com.example.comicop.dto.RegisterRequest;
import com.example.comicop.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

// @AuthenticationPrincipal — lấy email của user đang đăng nhập
// Spring Security tự inject email từ JWT token đã được xác thực trong JwtFilter
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // POST /api/auth/register — đăng ký tài khoản mới
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    // POST /api/auth/login — đăng nhập
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    // GET /api/auth/me — lấy thông tin user đang đăng nhập
    // Cần JWT token trong header Authorization: Bearer {token}
    @GetMapping("/me")
    public ResponseEntity<AccountDto> getCurrentUser(
            @AuthenticationPrincipal String email) {
        AccountDto user = authService.getCurrentUser(email);
        return ResponseEntity.ok(user);
    }

    // POST /api/auth/logout — đăng xuất
    // JWT stateless nên server không cần làm gì — client tự xoá token
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("Đăng xuất thành công");
    }
}