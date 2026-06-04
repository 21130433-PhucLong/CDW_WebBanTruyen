package com.example.comicop.repository;

import com.example.comicop.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    // Lấy reviews của 1 product
    List<Review> findByProduct_ProductId(Long productId);

    // Kiểm tra user đã review product này chưa
    boolean existsByAccount_UserIDAndProduct_ProductId(Long accountId, Long productId);
}