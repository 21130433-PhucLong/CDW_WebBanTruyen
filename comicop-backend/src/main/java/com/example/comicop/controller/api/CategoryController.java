package com.example.comicop.controller.api;

import com.example.comicop.dto.CategoryDto;
import com.example.comicop.dto.PageResponseDto;
import com.example.comicop.dto.ProductDto;
import com.example.comicop.service.CategoryService;
import com.example.comicop.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;
    private final ProductService productService;

    // GET /api/categories — tất cả thể loại
    @GetMapping
    public ResponseEntity<List<CategoryDto>> getAll() {
        return ResponseEntity.ok(categoryService.getAll());
    }

    // GET /api/categories/{id} — 1 thể loại
    @GetMapping("/{id}")
    public ResponseEntity<CategoryDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getById(id));
    }

    // GET /api/categories/{id}/manga — sản phẩm theo thể loại
    @GetMapping("/{id}/manga")
    public ResponseEntity<PageResponseDto<ProductDto>> getMangaByCategory(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(productService.getByCategory(id, page, size));
    }
}