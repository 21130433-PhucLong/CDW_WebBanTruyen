package com.example.comicop.repository;

import com.example.comicop.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    // Lấy giỏ hàng theo accountId — mỗi account 1 giỏ
    Optional<Cart> findByAccountId(Long accountId);
}