package com.example.comicop.service.implement;

import com.example.comicop.dto.CartDto;
import com.example.comicop.dto.CartItemDto;
import com.example.comicop.entity.Account;
import com.example.comicop.entity.Cart;
import com.example.comicop.entity.CartItem;
import com.example.comicop.entity.Product;
import com.example.comicop.exception.ResourceNotFoundException;
import com.example.comicop.repository.AccountRepository;
import com.example.comicop.repository.CartItemRepository;
import com.example.comicop.repository.CartRepository;
import com.example.comicop.repository.ProductRepository;
import com.example.comicop.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final AccountRepository accountRepository;
    private final ProductRepository productRepository;

    // Ngưỡng miễn phí ship: 150,000đ
    private static final BigDecimal FREE_SHIP_THRESHOLD =
            new BigDecimal("150000");
    private static final BigDecimal SHIPPING_FEE =
            new BigDecimal("30000");

    // Chuyển CartItem entity → CartItemDto
    private CartItemDto mapItemToDto(CartItem item) {
        BigDecimal totalPrice = item.getProduct().getPrice()
                .multiply(new BigDecimal(item.getQuantity()));
        return CartItemDto.builder()
                .id(item.getCartItemId())
                .mangaId(item.getProduct().getProductId())
                .title(item.getProduct().getTitle())
                .coverImage(item.getProduct().getImageUrl())
                .price(item.getProduct().getPrice())
                .authorName(item.getProduct().getAuthor() != null
                        ? item.getProduct().getAuthor().getName() : "")
                .quantity(item.getQuantity())
                .totalPrice(totalPrice)
                .build();
    }

    // Chuyển Cart entity → CartDto — tính tổng tiền
    private CartDto mapToDto(Cart cart) {
        List<CartItemDto> itemDtos = cart.getCartItems().stream()
                .map(this::mapItemToDto)
                .collect(Collectors.toList());

        // Tính tạm tính
        BigDecimal subtotal = itemDtos.stream()
                .map(CartItemDto::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Phí ship: 0 nếu subtotal >= 150k, ngược lại 30k
        BigDecimal shippingFee = subtotal.compareTo(FREE_SHIP_THRESHOLD) >= 0
                ? BigDecimal.ZERO : SHIPPING_FEE;

        BigDecimal total = subtotal.add(shippingFee);

        return CartDto.builder()
                .cartId(cart.getCartId())
                .items(itemDtos)
                .subtotal(subtotal)
                .shippingFee(shippingFee)
                .total(total)
                .build();
    }

    // Lấy hoặc tạo mới giỏ hàng cho account
    private Cart getOrCreateCart(Long accountId) {
        return cartRepository.findByAccount_UserID(accountId)
                .orElseGet(() -> {
                    Account account = accountRepository.findById(accountId)
                            .orElseThrow(() -> new ResourceNotFoundException(
                                    "Không tìm thấy account: " + accountId));
                    Cart newCart = new Cart();
                    newCart.setAccount(account);
                    return cartRepository.save(newCart);
                });
    }

    @Override
    public CartDto getCart(Long accountId) {
        Cart cart = getOrCreateCart(accountId);
        return mapToDto(cart);
    }

    @Override
    public CartDto addItem(Long accountId, Long productId, int quantity) {
        Cart cart = getOrCreateCart(accountId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy sản phẩm: " + productId));

        // Kiểm tra sản phẩm đã có trong giỏ chưa
        Optional<CartItem> existingItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getProductId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            // Đã có → cộng thêm số lượng
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            cartItemRepository.save(item);
        } else {
            // Chưa có → thêm mới
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            cart.getCartItems().add(newItem);
            cartItemRepository.save(newItem);
        }

        return mapToDto(cart);
    }

    @Override
    public CartDto updateItem(Long accountId, Long cartItemId, int quantity) {
        Cart cart = getOrCreateCart(accountId);

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy cart item: " + cartItemId));

        if (quantity <= 0) {
            // Số lượng <= 0 → xoá luôn
            cart.getCartItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        return mapToDto(cart);
    }

    @Override
    public CartDto removeItem(Long accountId, Long cartItemId) {
        Cart cart = getOrCreateCart(accountId);

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy cart item: " + cartItemId));

        cart.getCartItems().remove(item);
        cartItemRepository.delete(item);

        return mapToDto(cart);
    }

    @Override
    public void clearCart(Long accountId) {
        Cart cart = getOrCreateCart(accountId);
        // Xoá tất cả items
        cartItemRepository.deleteByCart_CartId(cart.getCartId());
        cart.getCartItems().clear();
        cartRepository.save(cart);
    }
}