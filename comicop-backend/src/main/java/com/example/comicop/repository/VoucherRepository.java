package com.example.comicop.repository;

import com.example.comicop.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface VoucherRepository extends JpaRepository<Voucher, Long> {
    // Tìm voucher theo code và còn active — dùng khi validate voucher
    Optional<Voucher> findByCodeAndIsActiveTrue(String code);
}