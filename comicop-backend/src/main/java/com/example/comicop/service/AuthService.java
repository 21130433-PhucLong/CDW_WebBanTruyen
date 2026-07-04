package com.example.comicop.service;

import com.example.comicop.dto.AccountDto;
import com.example.comicop.dto.AuthRequest;
import com.example.comicop.dto.AuthResponse;
import com.example.comicop.dto.ChangePasswordRequest;
import com.example.comicop.dto.RegisterRequest;
import org.springframework.web.multipart.MultipartFile;

public interface AuthService {
    // Đăng ký tài khoản mới, trả về token + user
    AuthResponse register(RegisterRequest request);

    // Đăng nhập, trả về token + user
    AuthResponse login(AuthRequest request);

    // Lấy thông tin user hiện tại từ email (đọc từ JWT)
    AccountDto getCurrentUser(String email);

    // Method mới — cập nhật avatar
    AccountDto updateAvatar(String email, MultipartFile file);

    AccountDto updateProfile(String email, AccountDto accountDto);

    void changePassword(String email, ChangePasswordRequest request);
}