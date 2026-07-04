package com.example.comicop.service.implement;

import com.example.comicop.dto.AddressDto;
import com.example.comicop.dto.CreateAddressRequest;
import com.example.comicop.entity.Account;
import com.example.comicop.entity.Address;
import com.example.comicop.exception.ResourceNotFoundException;
import com.example.comicop.repository.AccountRepository;
import com.example.comicop.repository.AddressRepository;
import com.example.comicop.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final AccountRepository accountRepository;

    // Map entity → DTO
    private AddressDto mapToDto(Address address) {
        return AddressDto.builder()
                .addressId(address.getAddressId())
                .fullName(address.getFullName())
                .phone(address.getPhone())
                .street(address.getStreet())
                .provinceCode(address.getProvinceCode())
                .provinceName(address.getProvinceName())
                .wardCode(address.getWardCode())
                .wardName(address.getWardName())
                .fullAddress(address.getFullAddress())
                .isDefault(address.getIsDefault())
                .build();
    }

    // Tạo chuỗi địa chỉ đầy đủ để lưu vào shippingAddress của Order
    private String buildFullAddress(CreateAddressRequest req) {
        return req.getStreet() + ", "
                + req.getWardName() + ", "
                + req.getProvinceName();
    }

    @Override
    public List<AddressDto> getAddresses(Long accountId) {
        return addressRepository.findByAccount_UserID(accountId)
                .stream().map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public AddressDto createAddress(Long accountId, CreateAddressRequest request) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy account: " + accountId));

        // Nếu đặt mặc định thì bỏ mặc định các địa chỉ cũ trước
        if (Boolean.TRUE.equals(request.getIsDefault())) {
            addressRepository.resetDefaultByAccountId(accountId);
        }

        Address address = new Address();
        address.setFullName(request.getFullName());
        address.setPhone(request.getPhone());
        address.setStreet(request.getStreet());
        address.setProvinceCode(request.getProvinceCode());
        address.setProvinceName(request.getProvinceName());
        address.setWardCode(request.getWardCode());
        address.setWardName(request.getWardName());
        address.setFullAddress(buildFullAddress(request));
        address.setIsDefault(request.getIsDefault() != null
                && request.getIsDefault());
        address.setAccount(account);

        return mapToDto(addressRepository.save(address));
    }

    @Override
    public AddressDto setDefault(Long addressId, Long accountId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy địa chỉ: " + addressId));

        if (!address.getAccount().getUserID().equals(accountId)) {
            throw new RuntimeException("Không có quyền chỉnh sửa địa chỉ này");
        }

        // Bỏ mặc định tất cả địa chỉ cũ → đặt địa chỉ này làm mặc định
        addressRepository.resetDefaultByAccountId(accountId);
        address.setIsDefault(true);
        return mapToDto(addressRepository.save(address));
    }

    @Override
    public void deleteAddress(Long addressId, Long accountId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy địa chỉ: " + addressId));

        if (!address.getAccount().getUserID().equals(accountId)) {
            throw new RuntimeException("Không có quyền xoá địa chỉ này");
        }

        addressRepository.delete(address);
    }
}