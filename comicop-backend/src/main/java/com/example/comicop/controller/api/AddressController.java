package com.example.comicop.controller.api;

import com.example.comicop.dto.AddressDto;
import com.example.comicop.dto.CreateAddressRequest;
import com.example.comicop.repository.AccountRepository;
import com.example.comicop.service.AddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;
    private final AccountRepository accountRepository;

    private Long getAccountId(String email) {
        var account = accountRepository.findByEmail(email);
        if (account == null) throw new RuntimeException("Không tìm thấy account");
        return account.getUserID();
    }

    // GET /api/addresses — lấy danh sách địa chỉ
    @GetMapping
    public ResponseEntity<List<AddressDto>> getAddresses(
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(
                addressService.getAddresses(getAccountId(email)));
    }

    // POST /api/addresses — thêm địa chỉ mới
    @PostMapping
    public ResponseEntity<AddressDto> createAddress(
            @AuthenticationPrincipal String email,
            @Valid @RequestBody CreateAddressRequest request) {
        return ResponseEntity.ok(
                addressService.createAddress(getAccountId(email), request));
    }

    // PUT /api/addresses/{id}/default — đặt làm mặc định
    @PutMapping("/{id}/default")
    public ResponseEntity<AddressDto> setDefault(
            @AuthenticationPrincipal String email,
            @PathVariable Long id) {
        return ResponseEntity.ok(
                addressService.setDefault(id, getAccountId(email)));
    }

    // DELETE /api/addresses/{id} — xoá địa chỉ
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(
            @AuthenticationPrincipal String email,
            @PathVariable Long id) {
        addressService.deleteAddress(id, getAccountId(email));
        return ResponseEntity.ok().build();
    }
}