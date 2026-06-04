package com.example.comicop.repository;

import com.example.comicop.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    // Xoá tất cả item trong 1 giỏ — dùng khi đặt hàng xong
    void deleteByCart_CartId(Long cartId);
}