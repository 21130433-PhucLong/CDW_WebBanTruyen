package com.example.comicop.service.implement;

import com.example.comicop.dto.AccountDto;
import com.example.comicop.entity.Account;
import com.example.comicop.exception.ResourceNotFoundException;
import com.example.comicop.mapper.AccountMapper;
import com.example.comicop.repository.AccountRepository;
import com.example.comicop.service.AccountService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

// @Service — đánh dấu class này là Service layer
// Spring tự tạo và quản lý object của class này (Dependency Injection)
// @AllArgsConstructor — Lombok tự tạo constructor có tham số
// Spring dùng constructor này để inject AccountRepository vào
@Service
@AllArgsConstructor
public class AccountServiceImpl implements AccountService {

    // Spring tự inject AccountRepository vào đây qua constructor
    private AccountRepository accountRepository;

    @Override
    public AccountDto createAccount(AccountDto accountDto) {
        // Bước 1: Chuyển DTO thành Entity để lưu vào DB
        Account account = AccountMapper.accountDtoToAccount(accountDto);
        // Bước 2: Lưu vào DB — JPA tự chạy INSERT SQL
        Account savedAccount = accountRepository.save(account);
        // Bước 3: Chuyển Entity vừa lưu thành DTO trả về cho client
        return AccountMapper.accountToAccountDto(savedAccount);
    }

    @Override
    public AccountDto findAccountById(Long accountId) {
        // findById trả về Optional — nếu không tìm thấy thì ném exception
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy account với id: " + accountId));
        return AccountMapper.accountToAccountDto(account);
    }

    @Override
    public List<AccountDto> findAllAccounts() {
        // findAll() lấy tất cả — dùng stream().map() để convert từng item
        List<Account> accounts = accountRepository.findAll();
        return accounts.stream()
                .map(AccountMapper::accountToAccountDto)
                .collect(Collectors.toList());
    }

    @Override
    public AccountDto updateAccount(Long accountId, AccountDto updatedAccountDto) {
        // Tìm account cần update — throw exception nếu không tìm thấy
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy account với id: " + accountId));

        // Cập nhật các field
        // Muốn update thêm field nào thì bỏ comment dòng đó ra
        account.setEmail(updatedAccountDto.getEmail());
        // account.setFirstName(updatedAccountDto.getFirstName());
        // account.setLastName(updatedAccountDto.getLastName());
        // account.setPhone(updatedAccountDto.getPhone());
        // account.setGender(updatedAccountDto.getGender());
        // account.setImg(updatedAccountDto.getImg());

        // Lưu lại vào DB — JPA tự chạy UPDATE SQL
        Account updatedAccount = accountRepository.save(account);
        return AccountMapper.accountToAccountDto(updatedAccount);
    }

    @Override
    public void deleteAccount(Long accountId) {
        // Kiểm tra tồn tại trước khi xoá
        accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy account với id: " + accountId));
        // Xoá khỏi DB — JPA tự chạy DELETE SQL
        accountRepository.deleteById(accountId);
    }
}