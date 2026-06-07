package com.example.comicop.service.implement;

import com.example.comicop.dto.VoucherDto;
import com.example.comicop.entity.Voucher;
import com.example.comicop.repository.VoucherRepository;
import com.example.comicop.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class VoucherServiceImpl implements VoucherService {

    private final VoucherRepository voucherRepository;

    @Override
    public VoucherDto validateVoucher(String code) {
        var voucherOpt = voucherRepository.findByCodeAndIsActiveTrue(code.trim());

        // Không tìm thấy voucher
        if (voucherOpt.isEmpty()) {
            return new VoucherDto(null, code, 0,
                    null, false, "Mã giảm giá không tồn tại hoặc đã hết hạn");
        }

        Voucher voucher = voucherOpt.get();

        // Kiểm tra còn hạn không
        if (voucher.getExpiryDate() != null
                && voucher.getExpiryDate().isBefore(LocalDate.now())) {
            return new VoucherDto(voucher.getVoucherId(), code, 0,
                    voucher.getExpiryDate(), false, "Mã giảm giá đã hết hạn");
        }

        // Kiểm tra còn lượt dùng không
        if (voucher.getMaxUses() != null
                && voucher.getUsedCount() >= voucher.getMaxUses()) {
            return new VoucherDto(voucher.getVoucherId(), code, 0,
                    voucher.getExpiryDate(), false, "Mã giảm giá đã hết lượt sử dụng");
        }

        // Voucher hợp lệ
        return new VoucherDto(
                voucher.getVoucherId(),
                voucher.getCode(),
                voucher.getDiscountPercent(),
                voucher.getExpiryDate(),
                true,
                "Áp dụng thành công! Giảm " + voucher.getDiscountPercent() + "%"
        );
    }
}