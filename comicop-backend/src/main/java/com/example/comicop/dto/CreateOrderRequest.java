package com.example.comicop.dto;

import lombok.*;

// DTO nhận dữ liệu đặt hàng từ frontend
// Frontend gửi lên khi user nhấn "Xác nhận đặt hàng"
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {

    // Địa chỉ giao hàng — lưu thẳng vào order
    // để không bị ảnh hưởng nếu user đổi địa chỉ sau này
    private String shippingAddress;

    // Phương thức thanh toán: COD
    private String paymentMethod;

    // Ghi chú cho đơn hàng
    private String note;

    // Mã voucher nếu có — optional
    private String voucherCode;
}