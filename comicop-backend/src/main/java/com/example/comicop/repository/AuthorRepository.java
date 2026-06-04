package com.example.comicop.repository;

import com.example.comicop.entity.Author;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AuthorRepository extends JpaRepository<Author, Long> {
    // Tìm tác giả theo tên — tìm kiếm không phân biệt hoa thường
    List<Author> findByNameContainingIgnoreCase(String name);
}