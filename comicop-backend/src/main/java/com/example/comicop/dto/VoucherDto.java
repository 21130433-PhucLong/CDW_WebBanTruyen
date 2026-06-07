package com.example.comicop.dto;

import lombok.*;
import java.time.LocalDate;

// DTO trả về thông tin voucher sau khi validate
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VoucherDto {

    private Long voucherId;
    private String code;

    // Phần trăm giảm giá: 10 = giảm 10%
    private Integer discountPercent;

    private LocalDate expiryDate;
    private Boolean isActive;

    // Thông báo kết quả validate
    private String message;
}