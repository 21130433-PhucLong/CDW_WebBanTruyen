package com.example.comicop.service;

import com.example.comicop.dto.VoucherDto;

public interface VoucherService {
    // Validate mã voucher — kiểm tra còn hiệu lực không
    VoucherDto validateVoucher(String code);
}