package com.example.comicop.service;

import com.example.comicop.dto.AccountDto;
import java.util.List;

// Interface định nghĩa các method service có
// Controller chỉ biết đến interface, không biết đến implementation
public interface AccountService {

    // Tạo account mới
    AccountDto createAccount(AccountDto accountDto);

    // Tìm account theo ID
    AccountDto findAccountById(Long accountId);

    // Lấy tất cả account
    List<AccountDto> findAllAccounts();

    // Cập nhật thông tin account
    AccountDto updateAccount(Long accountId, AccountDto updatedAccountDto);

    // Xoá account
    void deleteAccount(Long accountId);
}