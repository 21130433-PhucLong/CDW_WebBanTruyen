package com.example.comicop.controller.api;

import com.example.comicop.dto.PageResponseDto;
import com.example.comicop.dto.ProductDto;
import com.example.comicop.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/manga")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // GET /api/manga?page=0&size=12&sortBy=newest
    // Trả về danh sách có phân trang — dùng ở trang /manga
    @GetMapping
    public ResponseEntity<PageResponseDto<ProductDto>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "newest") String sortBy) {
        return ResponseEntity.ok(productService.getAll(page, size, sortBy));
    }

    // GET /api/manga/featured — sản phẩm nổi bật cho trang chủ
    @GetMapping("/featured")
    public ResponseEntity<List<ProductDto>> getFeatured() {
        return ResponseEntity.ok(productService.getFeatured());
    }

    // GET /api/manga/new — sản phẩm mới nhất cho trang chủ
    @GetMapping("/new")
    public ResponseEntity<List<ProductDto>> getNewReleases() {
        return ResponseEntity.ok(productService.getNewReleases());
    }

    // GET /api/manga/top-selling — top bán chạy
    @GetMapping("/top-selling")
    public ResponseEntity<List<ProductDto>> getTopSelling() {
        return ResponseEntity.ok(productService.getTopSelling());
    }

    // GET /api/manga/search?q=onepiece&page=0&size=12
    @GetMapping("/search")
    public ResponseEntity<PageResponseDto<ProductDto>> search(
            @RequestParam("q") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(productService.search(keyword, page, size));
    }

    // GET /api/manga/{id} — chi tiết 1 sản phẩm
    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getById(id));
    }

    // GET /api/manga/{id}/related — sản phẩm liên quan
    @GetMapping("/{id}/related")
    public ResponseEntity<List<ProductDto>> getRelated(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getRelated(id));
    }
}