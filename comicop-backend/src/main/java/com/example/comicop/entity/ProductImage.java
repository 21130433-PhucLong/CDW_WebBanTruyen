package com.example.comicop.entity;

import jakarta.persistence.*;
import lombok.*;

// Entity lưu nhiều ảnh cho 1 sản phẩm — thêm mới, zip chưa có
// Dùng cho chức năng gallery ảnh khi xem chi tiết sản phẩm
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "product_image")
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "image_id")
    private Long imageId;

    // Link ảnh
    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    // Thứ tự hiển thị trong gallery (0, 1, 2...)
    @Column(name = "sort_order")
    private Integer sortOrder = 0;

    // Nhiều ảnh thuộc 1 Product
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Product product;
}