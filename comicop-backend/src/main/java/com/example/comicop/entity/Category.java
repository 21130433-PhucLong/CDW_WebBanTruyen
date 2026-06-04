package com.example.comicop.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

// Enable lại từ zip — bổ sung đầy đủ fields và quan hệ
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "category")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long categoryId;

    // Tên thể loại: Manga, Light Novel, Tiểu thuyết...
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    // slug dùng cho URL: manga, light-novel, tieu-thuyet
    @Column(name = "slug", unique = true)
    private String slug;

    // Quan hệ 1 Category có nhiều Product
    // mappedBy = tên field trong Product trỏ về Category
    // fetch LAZY = chỉ load products khi cần, không load tự động
    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<Product> products;
}