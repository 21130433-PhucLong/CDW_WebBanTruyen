package com.example.comicop.service;

import com.example.comicop.dto.PageResponseDto;
import com.example.comicop.dto.ProductDto;
import java.util.List;

public interface ProductService {
    // Lấy tất cả có phân trang và sắp xếp
    PageResponseDto<ProductDto> getAll(int page, int size, String sortBy);

    // Lấy theo ID
    ProductDto getById(Long id);

    // Lấy sản phẩm nổi bật cho trang chủ
    List<ProductDto> getFeatured();

    // Lấy sản phẩm mới nhất
    List<ProductDto> getNewReleases();

    // Tìm kiếm theo tên
    PageResponseDto<ProductDto> search(String keyword, int page, int size);

    // Lấy theo thể loại
    PageResponseDto<ProductDto> getByCategory(Long categoryId, int page, int size);

    // Lấy theo tác giả
    List<ProductDto> getByAuthor(Long authorId);

    // Top bán chạy
    List<ProductDto> getTopSelling();

    // Manga liên quan — cùng thể loại, trừ bản thân
    List<ProductDto> getRelated(Long productId);
}