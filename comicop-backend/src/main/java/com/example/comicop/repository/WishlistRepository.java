package com.example.comicop.repository;

import com.example.comicop.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    // Lấy wishlist của 1 account
    List<Wishlist> findByAccountId(Long accountId);

    // Kiểm tra đã thêm vào wishlist chưa
    boolean existsByAccountIdAndProductId(Long accountId, Long productId);

    // Tìm để xoá
    Optional<Wishlist> findByAccountIdAndProductId(Long accountId, Long productId);
}