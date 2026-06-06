package com.example.comicop.service;

import com.example.comicop.dto.ProductDto;
import java.util.List;

public interface WishlistService {
    // Lấy danh sách yêu thích của user
    List<ProductDto> getWishlist(Long accountId);

    // Thêm vào yêu thích
    void addToWishlist(Long accountId, Long productId);

    // Xoá khỏi yêu thích
    void removeFromWishlist(Long accountId, Long productId);

    // Kiểm tra đã yêu thích chưa
    boolean isWishlisted(Long accountId, Long productId);
}