package com.example.comicop.controller.api;

import com.example.comicop.dto.ProductDto;
import com.example.comicop.repository.AccountRepository;
import com.example.comicop.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;
    private final AccountRepository accountRepository;

    private Long getAccountId(String email) {
        var account = accountRepository.findByEmail(email);
        if (account == null) throw new RuntimeException("Account not found");
        return account.getUserID();
    }

    // GET /api/wishlist — lấy danh sách yêu thích
    @GetMapping("/wishlist")
    public ResponseEntity<List<ProductDto>> getWishlist(
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(
                wishlistService.getWishlist(getAccountId(email)));
    }

    // POST /api/manga/{id}/wishlist — thêm vào yêu thích
    @PostMapping("/manga/{id}/wishlist")
    public ResponseEntity<Map<String, Boolean>> addToWishlist(
            @AuthenticationPrincipal String email,
            @PathVariable Long id) {
        wishlistService.addToWishlist(getAccountId(email), id);
        return ResponseEntity.ok(Map.of("wishlisted", true));
    }

    // DELETE /api/manga/{id}/wishlist — xoá khỏi yêu thích
    @DeleteMapping("/manga/{id}/wishlist")
    public ResponseEntity<Map<String, Boolean>> removeFromWishlist(
            @AuthenticationPrincipal String email,
            @PathVariable Long id) {
        wishlistService.removeFromWishlist(getAccountId(email), id);
        return ResponseEntity.ok(Map.of("wishlisted", false));
    }

    // GET /api/manga/{id}/wishlist — kiểm tra đã yêu thích chưa
    @GetMapping("/manga/{id}/wishlist")
    public ResponseEntity<Map<String, Boolean>> checkWishlist(
            @AuthenticationPrincipal String email,
            @PathVariable Long id) {
        boolean isWishlisted = wishlistService.isWishlisted(
                getAccountId(email), id);
        return ResponseEntity.ok(Map.of("wishlisted", isWishlisted));
    }
}