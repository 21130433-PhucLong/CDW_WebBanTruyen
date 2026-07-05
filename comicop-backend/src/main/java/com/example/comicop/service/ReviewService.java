package com.example.comicop.service;

import com.example.comicop.dto.CreateReviewRequest;
import com.example.comicop.dto.ReviewDto;
import java.util.List;

public interface ReviewService {
    List<ReviewDto> getReviewsByProduct(Long productId);
    ReviewDto createReview(Long accountId, Long productId, CreateReviewRequest request);
}