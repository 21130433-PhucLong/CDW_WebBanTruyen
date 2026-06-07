package com.example.comicop.controller.api;

import com.example.comicop.dto.VoucherDto;
import com.example.comicop.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vouchers")
@RequiredArgsConstructor
public class VoucherController {

    private final VoucherService voucherService;

    // GET /api/vouchers/validate?code=WELCOME10
    // Không cần đăng nhập để validate voucher
    @GetMapping("/validate")
    public ResponseEntity<VoucherDto> validateVoucher(
            @RequestParam String code) {
        return ResponseEntity.ok(voucherService.validateVoucher(code));
    }
}