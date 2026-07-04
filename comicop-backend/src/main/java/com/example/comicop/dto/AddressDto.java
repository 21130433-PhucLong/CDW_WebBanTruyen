package com.example.comicop.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressDto {
    private Long addressId;
    private String fullName;
    private String phone;
    private String street;
    private String provinceCode;
    private String provinceName;
    private String wardCode;
    private String wardName;
    private String fullAddress;
    private Boolean isDefault;
}