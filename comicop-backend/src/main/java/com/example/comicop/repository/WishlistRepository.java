package com.example.comicop.repository;

import com.example.comicop.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    // Lấy wishlist của 1 account
    List<Wishlist> findByAccount_UserID(Long accountId);

    // Kiểm tra đã thêm vào wishlist chưa
    boolean existsByAccount_UserIDAndProduct_ProductId(Long accountId, Long productId);

    // Tìm để xoá
    Optional<Wishlist> findByAccount_UserIDAndProduct_ProductId(Long accountId, Long productId);
}