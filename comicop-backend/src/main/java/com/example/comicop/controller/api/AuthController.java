package com.example.comicop.controller.api;

import com.example.comicop.dto.AccountDto;
import com.example.comicop.dto.AuthRequest;
import com.example.comicop.dto.AuthResponse;
import com.example.comicop.dto.RegisterRequest;
import com.example.comicop.dto.ChangePasswordRequest;
import com.example.comicop.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

// @AuthenticationPrincipal — lấy email của user đang đăng nhập
// Spring Security tự inject email từ JWT token đã được xác thực trong JwtFilter
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // POST /api/auth/register — đăng ký tài khoản mới
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    // POST /api/auth/login — đăng nhập
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
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

//    @PostMapping("/avatar")
//    public ResponseEntity<AccountDto> uploadAvatar(
//            @AuthenticationPrincipal String email,
//            @RequestParam("file") MultipartFile file) {
//        AccountDto updated = authService.updateAvatar(email, file);
//        return ResponseEntity.ok(updated);
//    }

    @PostMapping("/avatar")
    public ResponseEntity<AccountDto> uploadAvatar(
            @AuthenticationPrincipal String email,
            @RequestParam("file") MultipartFile file) {

        System.out.println("========== AVATAR API ==========");
        System.out.println("EMAIL = " + email);
        System.out.println("FILE = " + file.getOriginalFilename());

        AccountDto updated = authService.updateAvatar(email, file);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/me")
    public ResponseEntity<AccountDto> updateProfile(
            @AuthenticationPrincipal String email,
            @RequestBody AccountDto accountDto) {

        AccountDto updated = authService.updateProfile(email, accountDto);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @AuthenticationPrincipal String email,
            @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(email, request);
        return ResponseEntity.ok("Đổi mật khẩu thành công");
    }

    @GetMapping("/wallet")
    public ResponseEntity<java.math.BigDecimal> getWalletBalance(
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(authService.getWalletBalance(email));
    }

}