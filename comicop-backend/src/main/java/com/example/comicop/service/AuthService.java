package com.example.comicop.service;

import com.example.comicop.dto.AccountDto;
import com.example.comicop.dto.AuthRequest;
import com.example.comicop.dto.AuthResponse;
import com.example.comicop.dto.RegisterRequest;

public interface AuthService {
    // Đăng ký tài khoản mới, trả về token + user
    AuthResponse register(RegisterRequest request);

    // Đăng nhập, trả về token + user
    AuthResponse login(AuthRequest request);

    // Lấy thông tin user hiện tại từ email (đọc từ JWT)
    AccountDto getCurrentUser(String email);
}