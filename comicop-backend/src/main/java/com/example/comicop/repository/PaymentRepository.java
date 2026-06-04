package com.example.comicop.repository;

import com.example.comicop.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByComicOrderId(Long orderId);
}