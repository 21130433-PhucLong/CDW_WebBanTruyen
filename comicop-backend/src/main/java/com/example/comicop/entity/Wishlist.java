package com.example.comicop.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

// Wishlist — danh sách yêu thích của user
// Thêm mới hoàn toàn, zip chưa có
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "wishlist",
        // Đảm bảo 1 user không thêm cùng 1 sản phẩm vào wishlist 2 lần
        uniqueConstraints = @UniqueConstraint(columnNames = {"account_id", "product_id"}))
public class Wishlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "wishlist_id")
    private Long wishlistId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Account account;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}