import api from './api'

interface VoucherDto {
  voucherId: number | null
  code: string
  discountPercent: number
  expiryDate: string | null
  isActive: boolean
  message: string
}

export const voucherService = {
  // Validate mã voucher — GET /api/vouchers/validate?code=
  validate: (code: string) =>
    api.get<VoucherDto>(`/vouchers/validate?code=${encodeURIComponent(code)}`),
}