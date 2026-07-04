package com.example.comicop.controller.web;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

// Xử lý trang lỗi — implements ErrorController để Spring Boot dùng
// thay thế trang lỗi mặc định Whitelabel Error Page
@Controller
public class ErrorHandleController implements ErrorController {

    // GET /error — hiển thị trang lỗi đẹp hơn Whitelabel
    @GetMapping("/error")
    public String viewErrorPage() {
        return "error"; // → render templates/error.html
    }
}