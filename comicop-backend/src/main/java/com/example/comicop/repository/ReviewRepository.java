package com.example.comicop.repository;

import com.example.comicop.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Lấy review theo sản phẩm — mới nhất trước
    List<Review> findByProduct_ProductIdOrderByCreatedAtDesc(Long productId);

    // Check user đã review sản phẩm này chưa — chặn review trùng
    Optional<Review> findByAccount_UserIDAndProduct_ProductId(
            Long accountId, Long productId);
}