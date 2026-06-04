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
// Tên bảng là comic_order để tránh conflict với từ khóa ORDER trong SQL
@Table(name = "comic_order")
public class ComicOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long orderId;

    // Nhiều đơn hàng của 1 account
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Account account;

    // Tổng tiền đơn hàng
    @Column(name = "total_price", precision = 10, scale = 2)
    private BigDecimal totalPrice;

    // Trạng thái: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
    @Column(name = "status")
    private String status = "PENDING";

    // Địa chỉ giao hàng — lưu dạng text để không bị ảnh hưởng khi user đổi địa chỉ sau
    @Column(name = "shipping_address", columnDefinition = "TEXT")
    private String shippingAddress;

    // Phương thức thanh toán: COD
    @Column(name = "payment_method")
    private String paymentMethod = "COD";

    // Ghi chú đơn hàng
    @Column(name = "note")
    private String note;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Chi tiết từng sản phẩm trong đơn
    @OneToMany(mappedBy = "comicOrder", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderDetail> orderDetails;
}