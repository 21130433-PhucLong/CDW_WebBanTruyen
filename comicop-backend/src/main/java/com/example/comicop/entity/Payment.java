package com.example.comicop.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "payment")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Long paymentId;

    // Phương thức: COD
    @Column(name = "method")
    private String method;

    // Trạng thái thanh toán: PENDING, COMPLETED, FAILED
    @Column(name = "status")
    private String status;

    @Column(name = "amount", precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // 1 Payment gắn với 1 ComicOrder
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private ComicOrder comicOrder;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}