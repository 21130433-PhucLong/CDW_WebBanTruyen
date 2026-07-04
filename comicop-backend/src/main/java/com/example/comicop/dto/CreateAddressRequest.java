package com.example.comicop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateAddressRequest {

    @NotBlank(message = "Vui lòng nhập họ và tên")
    private String fullName;

    @NotBlank(message = "Vui lòng nhập số điện thoại")
    @Pattern(regexp = "^0\\d{9}$", message = "Số điện thoại không hợp lệ")
    private String phone;

    @NotBlank(message = "Vui lòng nhập số nhà, tên đường")
    private String street;

    @NotBlank(message = "Vui lòng chọn tỉnh/thành phố")
    private String provinceCode;

    @NotBlank(message = "Vui lòng chọn tỉnh/thành phố")
    private String provinceName;

    @NotBlank(message = "Vui lòng chọn phường/xã")
    private String wardCode;

    @NotBlank(message = "Vui lòng chọn phường/xã")
    private String wardName;

    private Boolean isDefault = false;
}