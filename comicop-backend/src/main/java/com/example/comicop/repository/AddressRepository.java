package com.example.comicop.repository;

import com.example.comicop.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {
    // Lấy tất cả địa chỉ của 1 account
    List<Address> findByAccount_UserID(Long accountId);

    // Lấy địa chỉ mặc định
    Optional<Address> findByAccount_UserIDAndIsDefaultTrue(Long accountId);

    @Modifying
    @Transactional
    @Query("UPDATE Address a SET a.isDefault = false WHERE a.account.userID = :accountId")
    void resetDefaultByAccountId(Long accountId);
}