package com.example.comicop.service;

import com.example.comicop.dto.CartDto;

public interface CartService {
    // Lấy giỏ hàng của user — tạo mới nếu chưa có
    CartDto getCart(Long accountId);

    // Thêm sản phẩm vào giỏ — nếu đã có thì cộng thêm số lượng
    CartDto addItem(Long accountId, Long productId, int quantity);

    // Cập nhật số lượng sản phẩm
    CartDto updateItem(Long accountId, Long cartItemId, int quantity);

    // Xoá 1 sản phẩm khỏi giỏ
    CartDto removeItem(Long accountId, Long cartItemId);

    // Xoá toàn bộ giỏ — dùng sau khi đặt hàng thành công
    void clearCart(Long accountId);
}