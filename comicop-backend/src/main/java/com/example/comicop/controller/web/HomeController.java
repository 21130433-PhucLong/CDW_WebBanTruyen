package com.example.comicop.controller.web;

import com.example.comicop.service.AuthorService;
import com.example.comicop.service.CategoryService;
import com.example.comicop.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

// Controller xử lý các trang Thymeleaf — khác với REST API controller
// @Controller thay vì @RestController — trả về tên template thay vì JSON
@Controller
@RequiredArgsConstructor
public class HomeController {

    private final ProductService productService;
    private final CategoryService categoryService;
    private final AuthorService authorService;

    // GET / — trang chủ Thymeleaf
    @GetMapping("/")
    public String showHomepage(Model model) {
        // Đưa data vào model → Thymeleaf đọc bằng ${featuredManga}
        model.addAttribute("featuredManga",
                productService.getFeatured());
        model.addAttribute("newManga",
                productService.getNewReleases());
        model.addAttribute("categories",
                categoryService.getAll());
        model.addAttribute("popularAuthors",
                authorService.getPopular());
        return "index"; // → render templates/index.html
    }

    // GET /manga/{id} — trang chi tiết manga Thymeleaf
    @GetMapping("/manga/{id}")
    public String showMangaDetail(
            @org.springframework.web.bind.annotation.PathVariable Long id,
            Model model) {
        model.addAttribute("manga", productService.getById(id));
        return "manga-detail"; // → render templates/manga-detail.html
    }
}