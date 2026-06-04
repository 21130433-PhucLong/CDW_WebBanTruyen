package com.example.comicop.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long productId;

    @Column(name = "title", nullable = false)
    private String title;

    // Mô tả ngắn hiển thị trên card
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    // Giá dùng BigDecimal để tránh lỗi làm tròn số thập phân
    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    // Số lượng tồn kho — trừ đi khi đặt hàng thành công
    @Column(name = "stock")
    private Integer stock = 0;

    // Ảnh bìa chính
    @Column(name = "image_url")
    private String imageUrl;

    // Có phải sản phẩm nổi bật không — hiển thị ở trang chủ
    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    // Rating trung bình — cập nhật mỗi khi có review mới
    @Column(name = "average_rating")
    private Double averageRating = 0.0;

    // Số lượng đã bán — dùng cho top bán chạy
    @Column(name = "sold_count")
    private Integer soldCount = 0;

    // Nhà xuất bản: NXB Kim Đồng, NXB Trẻ...
    @Column(name = "publisher")
    private String publisher;

    // Số trang của quyển sách
    @Column(name = "pages")
    private Integer pages;

    // Năm xuất bản
    @Column(name = "publish_year")
    private Integer publishYear;

    // Trạng thái: ongoing, completed, hiatus
    @Column(name = "status")
    private String status = "ongoing";

    // Thời gian tạo — tự set khi insert
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Thêm thời gian tạo tự động trước khi lưu
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Quan hệ nhiều Product thuộc 1 Category
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    // Quan hệ nhiều Product của 1 Author
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "author_id")
    private Author author;

    // Gallery nhiều ảnh cho 1 product — THÊM MỚI
    // cascade ALL: khi xoá product thì xoá luôn images
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<ProductImage> images;

    // Các reviews của product
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<Review> reviews;
}