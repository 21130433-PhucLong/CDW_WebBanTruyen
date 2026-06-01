package com.example.comicop.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

// JwtUtil — class tiện ích xử lý JWT token
// JWT = JSON Web Token — chuỗi mã hoá chứa thông tin user
// Sau khi đăng nhập thành công, server tạo JWT gửi về client
// Client gửi JWT trong header mỗi request để xác thực
@Component
public class JwtUtil {

    // Secret key đọc từ application.properties
    // Dùng để ký và xác thực token — phải giữ bí mật
    @Value("${jwt.secret:comicop-secret-key-very-long-string-2024}")
    private String secretKey;

    // Thời gian token hết hạn: 24 giờ (tính bằng milliseconds)
    @Value("${jwt.expiration:86400000}")
    private long expiration;

    // Tạo SecretKey từ chuỗi secretKey
    private SecretKey getSignKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    // Tạo JWT token từ email và role của user
    public String generateToken(String email, String role) {
        Map<String, Object> claims = new HashMap<>();
        // Lưu role vào token để sau này kiểm tra quyền
        claims.put("role", role);
        return Jwts.builder()
                .claims(claims)
                .subject(email)          // subject = email của user
                .issuedAt(new Date())    // thời điểm tạo token
                .expiration(new Date(System.currentTimeMillis() + expiration)) // hết hạn sau 24h
                .signWith(getSignKey())  // ký token bằng secret key
                .compact();
    }

    // Đọc tất cả claims (thông tin) từ token
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSignKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // Lấy email từ token
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    // Lấy role từ token
    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    // Kiểm tra token còn hạn không
    private boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    // Validate token: đúng email và chưa hết hạn
    public boolean validateToken(String token, String email) {
        final String extractedEmail = extractEmail(token);
        return extractedEmail.equals(email) && !isTokenExpired(token);
    }
}