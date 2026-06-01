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
    public static Account accountDtoToAccount(AccountDto accountDto) {
        return new Account(
                accountDto.getUserID(),
                accountDto.getUserName(),
                accountDto.getPassword(),
                accountDto.getEmail(),
                accountDto.getPhone(),
                accountDto.getFirstName(),
                accountDto.getLastName(),
                accountDto.getGender(),
                accountDto.getImg(),
                accountDto.getRole(),
                accountDto.isActivated()
        );
    }
}