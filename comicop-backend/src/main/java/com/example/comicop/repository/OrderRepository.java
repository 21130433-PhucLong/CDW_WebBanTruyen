package com.example.comicop.repository;

import com.example.comicop.entity.ComicOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<ComicOrder, Long> {
    // Lấy tất cả đơn hàng của 1 account — sắp xếp mới nhất trước
    List<ComicOrder> findByAccount_UserIDOrderByCreatedAtDesc(Long accountId);

}