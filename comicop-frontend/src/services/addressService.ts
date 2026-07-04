import api from './api'

export interface AddressDto {
  addressId: number
  fullName: string
  phone: string
  street: string
  provinceCode: string
  provinceName: string
  wardCode: string
  wardName: string
  fullAddress: string
  isDefault: boolean
}

export interface CreateAddressRequest {
  fullName: string
  phone: string
  street: string
  provinceCode: string
  provinceName: string
  wardCode: string
  wardName: string
  isDefault?: boolean
}

export const addressService = {
  getAddresses: () => api.get<AddressDto[]>('/addresses'),
  createAddress: (data: CreateAddressRequest) =>
    api.post<AddressDto>('/addresses', data),
  setDefault: (id: number) =>
    api.put<AddressDto>(`/addresses/${id}/default`),
  deleteAddress: (id: number) =>
    api.delete(`/addresses/${id}`),
}