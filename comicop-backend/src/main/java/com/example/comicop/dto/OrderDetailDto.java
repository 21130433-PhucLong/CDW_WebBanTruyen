package com.example.comicop.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDetailDto {

    private Long orderDetailId;
    private Long productId;
    private String productTitle;
    private String productImage;

    // Số lượng mua
    private Integer quantity;

    // Giá tại thời điểm mua — không thay đổi dù giá sản phẩm sau này đổi
    private BigDecimal unitPrice;

    // Thành tiền = unitPrice × quantity
    private BigDecimal totalPrice;
}