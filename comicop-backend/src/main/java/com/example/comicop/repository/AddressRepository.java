package com.example.comicop.repository;

import com.example.comicop.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {
    // Lấy tất cả địa chỉ của 1 account
    List<Address> findByAccountId(Long accountId);

    // Lấy địa chỉ mặc định
    Optional<Address> findByAccountIdAndIsDefaultTrue(Long accountId);
}