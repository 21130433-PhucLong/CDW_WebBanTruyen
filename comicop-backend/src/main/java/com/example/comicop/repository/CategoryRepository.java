package com.example.comicop.repository;

import com.example.comicop.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    // Tìm theo slug — dùng cho URL /manga?category=manga
    Category findBySlug(String slug);
}