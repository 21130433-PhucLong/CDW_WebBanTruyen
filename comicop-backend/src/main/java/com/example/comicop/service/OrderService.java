package com.example.comicop.service;

import com.example.comicop.dto.CreateOrderRequest;
import com.example.comicop.dto.OrderDto;
import java.util.List;

public interface OrderService {

    // Tạo đơn hàng mới từ giỏ hàng hiện tại
    OrderDto createOrder(Long accountId, CreateOrderRequest request);

    // Lấy tất cả đơn hàng của 1 user — mới nhất trước
    List<OrderDto> getOrdersByAccount(Long accountId);

    // Lấy chi tiết 1 đơn hàng
    OrderDto getOrderById(Long orderId, Long accountId);

    // Huỷ đơn hàng — chỉ huỷ được khi status = PENDING
    OrderDto cancelOrder(Long orderId, Long accountId);

    OrderDto confirmPayment(Long orderId, Long accountId);
}