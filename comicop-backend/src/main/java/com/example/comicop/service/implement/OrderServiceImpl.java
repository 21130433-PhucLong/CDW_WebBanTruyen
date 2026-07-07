package com.example.comicop.service.implement;

import com.example.comicop.dto.CreateOrderRequest;
import com.example.comicop.dto.OrderDetailDto;
import com.example.comicop.dto.OrderDto;
import com.example.comicop.entity.*;
import com.example.comicop.exception.ResourceNotFoundException;
import com.example.comicop.repository.*;
import com.example.comicop.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final AccountRepository accountRepository;
    private final ProductRepository productRepository;
    private final VoucherRepository voucherRepository;
    private final PaymentRepository paymentRepository;

    // Chuyển ComicOrder entity → OrderDto
    private OrderDto mapToDto(ComicOrder order) {
        List<OrderDetailDto> detailDtos = order.getOrderDetails() != null
                ? order.getOrderDetails().stream().map(d -> OrderDetailDto.builder()
                        .orderDetailId(d.getOrderDetailId())
                        .productId(d.getProduct() != null ? d.getProduct().getProductId() : null)
                        .productTitle(d.getProduct() != null ? d.getProduct().getTitle() : "")
                        .productImage(d.getProduct() != null ? d.getProduct().getImageUrl() : "")
                        .quantity(d.getQuantity())
                        .unitPrice(d.getUnitPrice())
                        .totalPrice(d.getUnitPrice().multiply(
                                new BigDecimal(d.getQuantity())))
                        .build())
                .collect(Collectors.toList())
                : new ArrayList<>();

        return OrderDto.builder()
                .orderId(order.getOrderId())
                .status(order.getStatus())
                .totalPrice(order.getTotalPrice())
                .shippingAddress(order.getShippingAddress())
                .paymentMethod(order.getPaymentMethod())
                .note(order.getNote())
                .createdAt(order.getCreatedAt() != null
                        ? order.getCreatedAt().toString() : "")
                .orderDetails(detailDtos)
                .accountId(order.getAccount() != null
                        ? order.getAccount().getUserID() : null)
                .accountName(order.getAccount() != null
                        ? order.getAccount().getUserName() : "")
                .build();
    }

    @Override
    public OrderDto createOrder(Long accountId, CreateOrderRequest request) {
        // Lấy account
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy account: " + accountId));

        // Lấy giỏ hàng
        Cart cart = cartRepository.findByAccount_UserID(accountId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Giỏ hàng trống — không thể đặt hàng"));

        if (cart.getCartItems() == null || cart.getCartItems().isEmpty()) {
            throw new RuntimeException("Giỏ hàng trống — vui lòng thêm sản phẩm");
        }

        // Tính tổng tiền tạm tính
        BigDecimal subtotal = cart.getCartItems().stream()
                .map(item -> item.getProduct().getPrice()
                        .multiply(new BigDecimal(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Áp dụng voucher nếu có
        BigDecimal discount = BigDecimal.ZERO;
        if (request.getVoucherCode() != null
                && !request.getVoucherCode().trim().isEmpty()) {
            var voucherOpt = voucherRepository.findByCodeAndIsActiveTrue(
                    request.getVoucherCode().trim());
            if (voucherOpt.isPresent()) {
                Voucher voucher = voucherOpt.get();
                // Tính số tiền giảm = subtotal × discountPercent / 100
                discount = subtotal.multiply(
                                new BigDecimal(voucher.getDiscountPercent()))
                        .divide(new BigDecimal(100));
                // Cập nhật số lần đã dùng voucher
                voucher.setUsedCount(voucher.getUsedCount() + 1);
                // Nếu đã dùng đủ maxUses thì tắt voucher
                if (voucher.getMaxUses() != null
                        && voucher.getUsedCount() >= voucher.getMaxUses()) {
                    voucher.setIsActive(false);
                }
                voucherRepository.save(voucher);
            }
        }

        // Tính phí ship
        BigDecimal shippingFee = subtotal.compareTo(new BigDecimal("150000")) >= 0
                ? BigDecimal.ZERO : new BigDecimal("30000");

        // Tổng tiền = subtotal - discount + shippingFee
        BigDecimal totalPrice = subtotal.subtract(discount).add(shippingFee);

        // Tạo đơn hàng
        ComicOrder order = new ComicOrder();
        order.setAccount(account);
        order.setTotalPrice(totalPrice);
        order.setStatus("PENDING");
        order.setShippingAddress(request.getShippingAddress());
        order.setPaymentMethod(
                request.getPaymentMethod() != null
                        ? request.getPaymentMethod() : "COD");
        order.setNote(request.getNote());

        ComicOrder savedOrder = orderRepository.save(order);

        // Tạo OrderDetail cho từng item trong giỏ
        List<OrderDetail> details = new ArrayList<>();
        for (CartItem item : cart.getCartItems()) {
            OrderDetail detail = new OrderDetail();
            detail.setComicOrder(savedOrder);
            detail.setProduct(item.getProduct());
            detail.setQuantity(item.getQuantity());
            // Lưu giá TẠI THỜI ĐIỂM MUA — quan trọng
            detail.setUnitPrice(item.getProduct().getPrice());
            details.add(detail);
            orderDetailRepository.save(detail);

            // Trừ stock sản phẩm
            Product product = item.getProduct();
            int newStock = Math.max(0, product.getStock() - item.getQuantity());
            product.setStock(newStock);
            // Cộng soldCount
            product.setSoldCount(product.getSoldCount() + item.getQuantity());
            productRepository.save(product);
        }
        savedOrder.setOrderDetails(details);

        // Tạo bản ghi Payment
        Payment payment = new Payment();
        payment.setComicOrder(savedOrder);
        payment.setMethod(order.getPaymentMethod());
        payment.setStatus("PENDING");
        payment.setAmount(totalPrice);
        paymentRepository.save(payment);

        // Xoá giỏ hàng sau khi đặt hàng thành công
        cartItemRepository.deleteByCart_CartId(cart.getCartId());
        cart.getCartItems().clear();
        cartRepository.save(cart);

        return mapToDto(savedOrder);
    }

    @Override
    public List<OrderDto> getOrdersByAccount(Long accountId) {
        return orderRepository.findByAccount_UserIDOrderByCreatedAtDesc(accountId)
                .stream().map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public OrderDto getOrderById(Long orderId, Long accountId) {
        ComicOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy đơn hàng: " + orderId));

        // Kiểm tra đơn hàng có thuộc về account này không
        if (!order.getAccount().getUserID().equals(accountId)) {
            throw new RuntimeException("Không có quyền xem đơn hàng này");
        }
        return mapToDto(order);
    }

    @Override
    public OrderDto cancelOrder(Long orderId, Long accountId) {
        ComicOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy đơn hàng: " + orderId));

        if (!order.getAccount().getUserID().equals(accountId)) {
            throw new RuntimeException("Không có quyền huỷ đơn hàng này");
        }

        // Chỉ huỷ được khi đang PENDING
        if (!"PENDING".equals(order.getStatus())) {
            throw new RuntimeException(
                    "Chỉ có thể huỷ đơn hàng đang chờ xử lý");
        }

        order.setStatus("CANCELLED");

        // Hoàn lại stock khi huỷ đơn
        if (order.getOrderDetails() != null) {
            for (OrderDetail detail : order.getOrderDetails()) {
                Product product = detail.getProduct();
                product.setStock(product.getStock() + detail.getQuantity());
                product.setSoldCount(
                        Math.max(0, product.getSoldCount() - detail.getQuantity()));
                productRepository.save(product);
            }
        }

        return mapToDto(orderRepository.save(order));
    }

    @Override
    public OrderDto confirmPayment(Long orderId, Long accountId) {
        ComicOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy đơn hàng: " + orderId));

        if (!order.getAccount().getUserID().equals(accountId)) {
            throw new RuntimeException("Không có quyền xác nhận đơn hàng này");
        }

        Account account = order.getAccount();
        java.math.BigDecimal orderTotal = order.getTotalPrice();

        if (account.getWalletBalance().compareTo(orderTotal) < 0) {
            throw new RuntimeException(
                    "Số dư không đủ để thanh toán. Số dư hiện tại: "
                            + account.getWalletBalance() + "đ");
        }

        account.setWalletBalance(account.getWalletBalance().subtract(orderTotal));
        accountRepository.save(account);

        Payment payment = paymentRepository.findByComicOrder_OrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy payment"));
        payment.setStatus("COMPLETED");
        paymentRepository.save(payment);

        order.setStatus("PROCESSING");
        return mapToDto(orderRepository.save(order));
    }
}