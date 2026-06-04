package com.example.comicop.dto;

import lombok.*;
import java.util.List;

// Wrapper cho response có phân trang
// Trả về cùng với totalPages, currentPage... để frontend render pagination
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PageResponseDto<T> {
    private List<T> content;
    private int totalPages;
    private long totalElements;
    private int currentPage;
    private int pageSize;
    private boolean isLast;
}