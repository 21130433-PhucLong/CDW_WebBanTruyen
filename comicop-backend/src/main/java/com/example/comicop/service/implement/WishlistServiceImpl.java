package com.example.comicop.service.implement;

import com.example.comicop.dto.ProductDto;
import com.example.comicop.entity.Account;
import com.example.comicop.entity.Product;
import com.example.comicop.entity.Wishlist;
import com.example.comicop.exception.ResourceNotFoundException;
import com.example.comicop.repository.AccountRepository;
import com.example.comicop.repository.ProductRepository;
import com.example.comicop.repository.WishlistRepository;
import com.example.comicop.service.ProductService;
import com.example.comicop.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final AccountRepository accountRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;

    @Override
    public List<ProductDto> getWishlist(Long accountId) {
        return wishlistRepository.findByAccount_UserID(accountId)
                .stream()
                .map(w -> productService.getById(w.getProduct().getProductId()))
                .collect(Collectors.toList());
    }

    @Override
    public void addToWishlist(Long accountId, Long productId) {
        // Kiểm tra đã có chưa — tránh duplicate
        if (wishlistRepository.existsByAccount_UserIDAndProduct_ProductId(accountId, productId)) {
            return;
        }

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy account: " + accountId));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy sản phẩm: " + productId));

        Wishlist wishlist = new Wishlist();
        wishlist.setAccount(account);
        wishlist.setProduct(product);
        wishlistRepository.save(wishlist);
    }

    @Override
    public void removeFromWishlist(Long accountId, Long productId) {
        wishlistRepository.findByAccount_UserIDAndProduct_ProductId(accountId, productId)
                .ifPresent(wishlistRepository::delete);
    }

    @Override
    public boolean isWishlisted(Long accountId, Long productId) {
        return wishlistRepository.existsByAccount_UserIDAndProduct_ProductId(
                accountId, productId);
    }
}