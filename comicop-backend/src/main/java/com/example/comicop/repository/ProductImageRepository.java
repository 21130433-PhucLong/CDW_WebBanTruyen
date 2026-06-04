package com.example.comicop.repository;

import com.example.comicop.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    // Lấy tất cả ảnh của 1 product, sắp xếp theo sortOrder
    List<ProductImage> findByProductIdOrderBySortOrder(Long productId);
}