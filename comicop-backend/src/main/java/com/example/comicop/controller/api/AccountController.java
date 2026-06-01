package com.example.comicop.controller.api;

import com.example.comicop.dto.AccountDto;
import com.example.comicop.service.AccountService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// @RestController — class này xử lý HTTP request và trả về JSON
// @RequestMapping("/api/accounts") — tất cả endpoint bắt đầu bằng /api/accounts
// @AllArgsConstructor — Lombok inject AccountService qua constructor
@AllArgsConstructor
@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    // Spring inject AccountService vào đây
    private AccountService accountService;

    // POST /api/accounts — tạo account mới
    // @RequestBody — đọc JSON từ request body và chuyển thành AccountDto
    @PostMapping
    public ResponseEntity<AccountDto> createAccount(@RequestBody AccountDto accountDto) {
        AccountDto savedAccountDto = accountService.createAccount(accountDto);
        // HTTP 201 Created — tạo mới thành công
        return new ResponseEntity<>(savedAccountDto, HttpStatus.CREATED);
    }

    // GET /api/accounts/{id} — lấy account theo ID
    // @PathVariable — lấy giá trị {id} từ URL
    @GetMapping("{id}")
    public ResponseEntity<AccountDto> getAccountById(@PathVariable("id") Long accountId) {
        AccountDto accountDto = accountService.findAccountById(accountId);
        return ResponseEntity.ok(accountDto);
    }

    // GET /api/accounts — lấy tất cả account
    @GetMapping
    public ResponseEntity<List<AccountDto>> getAllAccounts() {
        List<AccountDto> accountDtos = accountService.findAllAccounts();
        return ResponseEntity.ok(accountDtos);
    }

    // PUT /api/accounts/{id} — cập nhật account
    @PutMapping("{id}")
    public ResponseEntity<AccountDto> updateAccount(
            @PathVariable("id") Long accountId,
            @RequestBody AccountDto updatedAccountDto) {
        AccountDto accountDto = accountService.updateAccount(accountId, updatedAccountDto);
        return ResponseEntity.ok(accountDto);
    }

    // DELETE /api/accounts/{id} — xoá account
    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteAccount(@PathVariable("id") Long accountId) {
        accountService.deleteAccount(accountId);
        return ResponseEntity.ok("Account deleted successfully!");
    }
}