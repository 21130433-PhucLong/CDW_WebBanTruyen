package com.example.comicop.entity;

import jakarta.persistence.*;
import lombok.*;

// @Entity — đánh dấu class này là 1 bảng trong database
// @Table(name = "account") — tên bảng trong PostgreSQL là "account"
// Hibernate sẽ tự tạo bảng này khi Spring Boot khởi động
@Entity
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "account")
public class Account {

    // @Id — đây là khoá chính (primary key)
    // @GeneratedValue — tự tăng ID (1, 2, 3...)
    // @Column(name = "user_id") — tên cột trong bảng là user_id
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userID;

    @Column(name = "username")
    private String userName;

    @Column(name = "password")
    private String password;

    // unique = true — không có 2 account cùng email
    // nullable = false — bắt buộc phải có email
    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "gender")
    private String gender;

    // Lưu đường dẫn ảnh đại diện
    @Column(name = "avatar_img")
    private String img;

    // Role: USER hoặc ADMIN
    @Column(name = "role")
    private String role;

    // Tài khoản có đang active không — mặc định true
    @Column(name = "is_activated")
    private boolean activated = true;

    // Các quan hệ với Order, Cart sẽ thêm sau
    // khi tạo entity Order và Cart ở Ngày 6
}