package com.example.comicop.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

// DTO trả về thông tin đơn hàng cho frontend
// Map với Order interface trong Cart.ts frontend
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDto {

    private Long orderId;
    private String status;
    private BigDecimal totalPrice;
    private String shippingAddress;
    private String paymentMethod;
    private String note;
    private String createdAt;

    // Danh sách sản phẩm trong đơn
    private List<OrderDetailDto> orderDetails;

    // Thông tin account đặt hàng
    private Long accountId;
    private String accountName;
}