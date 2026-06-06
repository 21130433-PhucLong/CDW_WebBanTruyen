package com.example.comicop.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemDto {

    private Long id;

    // Thông tin sản phẩm trong dòng giỏ hàng
    private Long mangaId;
    private String title;
    private String coverImage;
    private BigDecimal price;
    private String authorName;

    // Số lượng
    private int quantity;

    // Thành tiền = price × quantity
    private BigDecimal totalPrice;
}