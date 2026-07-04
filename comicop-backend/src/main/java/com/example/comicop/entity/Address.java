package com.example.comicop.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "address")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "address_id")
    private Long addressId;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "phone", nullable = false)
    private String phone;

    //số nhà tên đường
    @Column(name = "street", nullable = false)
    private String street;

    // Tỉnh/ TP - 2 cấp sau sáp nhật 2025
    @Column(name = "province_code")
    private String provinceCode;

    @Column(name = "province_name")
    private String provinceName;

    // Phường/Xã dưới Tỉnh
    @Column(name = "ward_code")
    private String wardCode;

    @Column(name = "ward_name")
    private String wardName;

    // Địa chỉ đầy đủ gộp lại để lưu vào shippingAddress cua Order
    @Column(name = "full_address")
    private String fullAddress;

    // Có phải địa chỉ mặc định không
    @Column(name = "is_default")
    private Boolean isDefault = false;

    // Nhiều địa chỉ của 1 account
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;
}