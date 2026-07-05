package com.example.comicop.controller.api;

import com.example.comicop.dto.CreateReviewRequest;
import com.example.comicop.dto.ReviewDto;
import com.example.comicop.repository.AccountRepository;
import com.example.comicop.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final AccountRepository accountRepository;

    private Long getAccountId(String email) {
        var account = accountRepository.findByEmail(email);
        if (account == null) throw new RuntimeException("Không tìm thấy account");
        return account.getUserID();
    }

    // GET /api/manga/{id}/reviews — public, ai cũng xem được
    @GetMapping("/api/manga/{productId}/reviews")
    public ResponseEntity<List<ReviewDto>> getReviews(
            @PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getReviewsByProduct(productId));
    }

    // POST /api/manga/{id}/reviews — cần đăng nhập
    @PostMapping("/api/manga/{productId}/reviews")
    public ResponseEntity<ReviewDto> createReview(
            @AuthenticationPrincipal String email,
            @PathVariable Long productId,
            @Valid @RequestBody CreateReviewRequest request) {
        Long accountId = getAccountId(email);
        return ResponseEntity.ok(
                reviewService.createReview(accountId, productId, request));
    }
}