package com.example.comicop.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// DTO trả về sau khi đăng nhập/đăng ký thành công
// Chứa JWT token và thông tin user
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    // JWT token — client lưu vào localStorage, gửi kèm mỗi request
    private String token;
    // Thông tin user — client dùng để hiển thị tên, avatar...
    private AccountDto user;
}