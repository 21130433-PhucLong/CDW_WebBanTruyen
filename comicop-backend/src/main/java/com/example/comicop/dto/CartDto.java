package com.example.comicop.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

// DTO trả về giỏ hàng — map với Cart interface trong frontend
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartDto {

    private Long cartId;

    // Danh sách sản phẩm trong giỏ
    private List<CartItemDto> items;

    // Tạm tính = tổng (giá × số lượng) của tất cả item
    private BigDecimal subtotal;

    // Phí vận chuyển — miễn phí nếu subtotal >= 150k
    private BigDecimal shippingFee;

    // Tổng cộng = subtotal + shippingFee
    private BigDecimal total;
}