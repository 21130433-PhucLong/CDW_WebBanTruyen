package com.example.comicop.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "order_detail")
public class OrderDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_detail_id")
    private Long orderDetailId;

    // Nhiều OrderDetail thuộc 1 ComicOrder
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private ComicOrder comicOrder;

    // Sản phẩm trong dòng đơn hàng
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "quantity")
    private Integer quantity;

    // Giá tại thời điểm mua — QUAN TRỌNG
    // Lưu riêng vì giá product có thể thay đổi sau này
    // Đơn hàng cũ vẫn giữ đúng giá lúc mua
    @Column(name = "unit_price", precision = 10, scale = 2)
    private BigDecimal unitPrice;
}