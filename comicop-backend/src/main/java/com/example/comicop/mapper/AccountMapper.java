package com.example.comicop.mapper;

import com.example.comicop.dto.AccountDto;
import com.example.comicop.entity.Account;

// Mapper — class chuyển đổi giữa Entity và DTO
// Entity <-> DTO không tự chuyển đổi được vì là 2 class khác nhau
// Mapper làm nhiệm vụ copy từng field từ class này sang class kia
public class AccountMapper {

    // Chuyển từ Entity (có trong DB) sang DTO (trả về cho client)
    public static AccountDto accountToAccountDto(Account account) {
        return new AccountDto(
                account.getUserID(),
                account.getUserName(),
                account.getPassword(),
                account.getEmail(),
                account.getPhone(),
                account.getFirstName(),
                account.getLastName(),
                account.getGender(),
                account.getImg(),
                account.getRole(),
                account.isActivated()
        );
    }

    // Chuyển từ DTO (nhận từ client) sang Entity (lưu vào DB)
    // Dùng setter thay vì constructor để tránh lỗi khi Entity có thêm field mới
    public static Account accountDtoToAccount(AccountDto accountDto) {
        Account account = new Account();
        account.setUserID(accountDto.getUserID());
        account.setUserName(accountDto.getUserName());
        account.setPassword(accountDto.getPassword());
        account.setEmail(accountDto.getEmail());
        account.setPhone(accountDto.getPhone());
        account.setFirstName(accountDto.getFirstName());
        account.setLastName(accountDto.getLastName());
        account.setGender(accountDto.getGender());
        account.setImg(accountDto.getImg());
        account.setRole(accountDto.getRole());
        account.setActivated(accountDto.isActivated());
        // cart, addresses, wishlists không set ở đây
        // vì chúng được quản lý riêng qua CartService, WishlistService
        return account;
    }
}