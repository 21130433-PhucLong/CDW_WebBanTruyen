package com.example.comicop.controller.api;

import com.example.comicop.dto.CreateOrderRequest;
import com.example.comicop.dto.OrderDto;
import com.example.comicop.repository.AccountRepository;
import com.example.comicop.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final AccountRepository accountRepository;

    private Long getAccountId(String email) {
        var account = accountRepository.findByEmail(email);
        if (account == null) throw new RuntimeException(
                "Không tìm thấy account");
        return account.getUserID();
    }

    // POST /api/orders — tạo đơn hàng mới từ giỏ hàng
    @PostMapping
    public ResponseEntity<OrderDto> createOrder(
            @AuthenticationPrincipal String email,
            @RequestBody CreateOrderRequest request) {
        return ResponseEntity.ok(
                orderService.createOrder(getAccountId(email), request));
    }

    // GET /api/orders — lấy tất cả đơn hàng của user
    @GetMapping
    public ResponseEntity<List<OrderDto>> getMyOrders(
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(
                orderService.getOrdersByAccount(getAccountId(email)));
    }

    // GET /api/orders/{id} — chi tiết 1 đơn hàng
    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getOrder(
            @AuthenticationPrincipal String email,
            @PathVariable Long id) {
        return ResponseEntity.ok(
                orderService.getOrderById(id, getAccountId(email)));
    }

    // POST /api/orders/{id}/cancel — huỷ đơn hàng
    @PostMapping("/{id}/cancel")
    public ResponseEntity<OrderDto> cancelOrder(
            @AuthenticationPrincipal String email,
            @PathVariable Long id) {
        return ResponseEntity.ok(
                orderService.cancelOrder(id, getAccountId(email)));
    }

    // POST /api/orders/{id}/confirm-payment — xác nhận đã thanh toán (giả lập)
    // Dùng cho CK ngân hàng và Momo — COD không cần gọi endpoint này
    @PostMapping("/{id}/confirm-payment")
    public ResponseEntity<OrderDto> confirmPayment(
            @AuthenticationPrincipal String email,
            @PathVariable Long id) {
        return ResponseEntity.ok(
                orderService.confirmPayment(id, getAccountId(email)));
    }

}