package com.example.comicop.repository;

import com.example.comicop.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    List<OrderDetail> findByComicOrder_OrderId(Long orderId);
}