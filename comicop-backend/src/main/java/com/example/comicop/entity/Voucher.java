package com.example.comicop.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "voucher")
public class Voucher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "voucher_id")
    private Long voucherId;

    // Mã voucher nhập khi thanh toán — unique
    @Column(name = "code", unique = true, nullable = false)
    private String code;

    // Phần trăm giảm giá: 10 = giảm 10%
    @Column(name = "discount_percent")
    private Integer discountPercent;

    // Ngày hết hạn
    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    // Voucher còn hoạt động không
    @Column(name = "is_active")
    private Boolean isActive = true;

    // Số lần dùng tối đa
    @Column(name = "max_uses")
    private Integer maxUses;

    // Số lần đã dùng
    @Column(name = "used_count")
    private Integer usedCount = 0;
}