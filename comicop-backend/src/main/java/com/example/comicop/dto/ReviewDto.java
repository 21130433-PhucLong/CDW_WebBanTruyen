package com.example.comicop.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewDto {
    private Long reviewId;
    private String userName;
    private Integer rating;
    private String comment;
    private String createdAt;
}