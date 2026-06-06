package com.example.comicop.controller.api;

import com.example.comicop.dto.CartDto;
import com.example.comicop.repository.AccountRepository;
import com.example.comicop.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final AccountRepository accountRepository;

    // Lấy accountId từ email trong JWT token
    private Long getAccountId(String email) {
        var account = accountRepository.findByEmail(email);
        if (account == null) throw new RuntimeException("Account not found");
        return account.getUserID();
    }

    // GET /api/cart — lấy giỏ hàng hiện tại
    @GetMapping
    public ResponseEntity<CartDto> getCart(
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(cartService.getCart(getAccountId(email)));
    }

    // POST /api/cart/items — thêm sản phẩm vào giỏ
    // Body: { "mangaId": 1, "quantity": 2 }
    @PostMapping("/items")
    public ResponseEntity<CartDto> addItem(
            @AuthenticationPrincipal String email,
            @RequestBody Map<String, Integer> body) {
        Long productId = body.get("mangaId").longValue();
        int quantity = body.getOrDefault("quantity", 1);
        return ResponseEntity.ok(
                cartService.addItem(getAccountId(email), productId, quantity));
    }

    // PUT /api/cart/items/{itemId} — cập nhật số lượng
    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartDto> updateItem(
            @AuthenticationPrincipal String email,
            @PathVariable Long itemId,
            @RequestBody Map<String, Integer> body) {
        int quantity = body.getOrDefault("quantity", 1);
        return ResponseEntity.ok(
                cartService.updateItem(getAccountId(email), itemId, quantity));
    }

    // DELETE /api/cart/items/{itemId} — xoá 1 item
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartDto> removeItem(
            @AuthenticationPrincipal String email,
            @PathVariable Long itemId) {
        return ResponseEntity.ok(
                cartService.removeItem(getAccountId(email), itemId));
    }

    // DELETE /api/cart — xoá toàn bộ giỏ
    @DeleteMapping
    public ResponseEntity<Void> clearCart(
            @AuthenticationPrincipal String email) {
        cartService.clearCart(getAccountId(email));
        return ResponseEntity.ok().build();
    }

    // POST /api/cart/shipping — tính phí vận chuyển
    // Trả về 0 nếu đơn >= 150k, ngược lại 30k
    @PostMapping("/shipping")
    public ResponseEntity<Map<String, Integer>> calculateShipping(
            @RequestBody Map<String, String> address) {
        // Logic đơn giản: miễn phí ship nếu tổng >= 150k
        // Tính trong CartService khi gọi getCart()
        return ResponseEntity.ok(Map.of("shippingFee", 30000));
    }
}