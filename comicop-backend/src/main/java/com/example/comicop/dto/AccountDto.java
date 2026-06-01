package com.example.comicop.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// DTO (Data Transfer Object) — object dùng để truyền data giữa các tầng
// Khác với Entity: DTO không liên kết trực tiếp với database
// Dùng DTO để kiểm soát chính xác data nào được gửi ra ngoài qua API
// Ví dụ: password có trong Entity nhưng không muốn trả về cho client
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AccountDto {

    private Long userID;
    private String userName;
    private String password;
    private String email;
    private String phone;
    private String firstName;
    private String lastName;
    private String gender;
    private String img;
    private String role;
    private boolean activated = true;
}