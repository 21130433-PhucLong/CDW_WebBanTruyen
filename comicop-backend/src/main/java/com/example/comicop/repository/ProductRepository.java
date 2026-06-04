package com.example.comicop.repository;

import com.example.comicop.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // Tìm kiếm theo tên — không phân biệt hoa thường
    Page<Product> findByTitleContainingIgnoreCase(String keyword, Pageable pageable);

    // Lấy sản phẩm nổi bật cho trang chủ
    List<Product> findByIsFeaturedTrue();

    // Lấy sản phẩm theo thể loại
    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);

    // Lấy sản phẩm theo tác giả
    List<Product> findByAuthorId(Long authorId);

    // Top 6 bán chạy nhất — sắp xếp theo soldCount giảm dần
    List<Product> findTop6ByOrderBySoldCountDesc();

    // Sản phẩm mới nhất — sắp xếp theo createdAt
    List<Product> findTop8ByOrderByCreatedAtDesc();
}