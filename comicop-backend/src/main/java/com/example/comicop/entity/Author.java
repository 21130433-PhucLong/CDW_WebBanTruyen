package com.example.comicop.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "author")
public class Author {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "author_id")
    private Long authorId;

    @Column(name = "name", nullable = false)
    private String name;

    // Quốc tịch tác giả
    @Column(name = "nationality")
    private String nationality;

    // Tiểu sử tác giả
    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    // Ảnh đại diện tác giả
    @Column(name = "avatar_url")
    private String avatarUrl;

    // 1 Author có nhiều Product
    @OneToMany(mappedBy = "author", fetch = FetchType.LAZY)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<Product> products;
}