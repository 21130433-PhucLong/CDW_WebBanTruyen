package com.example.comicop.service;

import com.example.comicop.dto.AddressDto;
import com.example.comicop.dto.CreateAddressRequest;
import java.util.List;

public interface AddressService {
    List<AddressDto> getAddresses(Long accountId);
    AddressDto createAddress(Long accountId, CreateAddressRequest request);
    AddressDto setDefault(Long addressId, Long accountId);
    void deleteAddress(Long addressId, Long accountId);
}