package com.example.comicop.controller.api;

import com.example.comicop.dto.AuthorDto;
import com.example.comicop.dto.ProductDto;
import com.example.comicop.service.AuthorService;
import com.example.comicop.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/authors")
@RequiredArgsConstructor
public class AuthorController {

    private final AuthorService authorService;
    private final ProductService productService;

    // GET /api/authors — tất cả tác giả
    @GetMapping
    public ResponseEntity<List<AuthorDto>> getAll() {
        return ResponseEntity.ok(authorService.getAll());
    }

    // GET /api/authors/popular — tác giả nổi tiếng cho trang chủ
    @GetMapping("/popular")
    public ResponseEntity<List<AuthorDto>> getPopular() {
        return ResponseEntity.ok(authorService.getPopular());
    }

    // GET /api/authors/{id} — chi tiết 1 tác giả
    @GetMapping("/{id}")
    public ResponseEntity<AuthorDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(authorService.getById(id));
    }

    // GET /api/authors/{id}/manga — sản phẩm của 1 tác giả
    @GetMapping("/{id}/manga")
    public ResponseEntity<List<ProductDto>> getMangaByAuthor(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getByAuthor(id));
    }
}