package com.example.comicop.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

// DTO trả về cho frontend — map với interface Manga trong Manga.ts
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDto {

    private Long id;
    private String title;
    private String description;

    // = coverImage trong Manga.ts
    private String coverImage;

    private BigDecimal price;

    // = rating trong Manga.ts
    private Double rating;

    private Integer stock;
    private Integer soldCount;
    private Boolean isFeatured;
    private Boolean isNew;

    // Thông tin tác giả lồng vào
    private AuthorDto author;

    // Danh sách thể loại
    private List<CategoryDto> categories;

    // Thông tin sách vật lý
    private String publisher;
    private Integer pages;
    private Integer publishYear;
    private String status;

    // Gallery ảnh — list link ảnh phụ
    private List<String> images;

    private String createdAt;
    private String updatedAt;
}