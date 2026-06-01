package com.example.comicop.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// @ResponseStatus — khi exception này được ném ra
// Spring tự trả về HTTP 404 Not Found cho client
@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

    // Nhận message mô tả lỗi, ví dụ: "Account not found with id: 5"
    public ResourceNotFoundException(String message) {
        super(message);
    }
}