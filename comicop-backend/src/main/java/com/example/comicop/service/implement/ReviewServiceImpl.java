package com.example.comicop.service.implement;

import com.example.comicop.dto.CreateReviewRequest;
import com.example.comicop.dto.ReviewDto;
import com.example.comicop.entity.Account;
import com.example.comicop.entity.Product;
import com.example.comicop.entity.Review;
import com.example.comicop.exception.ResourceNotFoundException;
import com.example.comicop.repository.AccountRepository;
import com.example.comicop.repository.ProductRepository;
import com.example.comicop.repository.ReviewRepository;
import com.example.comicop.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final AccountRepository accountRepository;

    private ReviewDto mapToDto(Review review) {
        return ReviewDto.builder()
                .reviewId(review.getReviewId())
                .userName(review.getAccount().getUserName())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt() != null
                        ? review.getCreatedAt().toString() : "")
                .build();
    }

    @Override
    public List<ReviewDto> getReviewsByProduct(Long productId) {
        return reviewRepository.findByProduct_ProductIdOrderByCreatedAtDesc(productId)
                .stream().map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ReviewDto createReview(Long accountId, Long productId,
                                  CreateReviewRequest request) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy account: " + accountId));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy sản phẩm: " + productId));

        // Chặn review trùng — mỗi user chỉ review 1 lần mỗi sản phẩm
        var existing = reviewRepository
                .findByAccount_UserIDAndProduct_ProductId(accountId, productId);
        if (existing.isPresent()) {
            throw new RuntimeException("Bạn đã đánh giá sản phẩm này rồi");
        }

        Review review = new Review();
        review.setAccount(account);
        review.setProduct(product);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        Review saved = reviewRepository.save(review);

        // Tính lại rating trung bình của sản phẩm
        List<Review> allReviews = reviewRepository
                .findByProduct_ProductIdOrderByCreatedAtDesc(productId);
        double avgRating = allReviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
        // Tròn 1 chữ số thập phân — ví dụ 4.67 → 4.7
        product.setAverageRating(Math.round(avgRating * 10) / 10.0);
        productRepository.save(product);

        return mapToDto(saved);
    }
}