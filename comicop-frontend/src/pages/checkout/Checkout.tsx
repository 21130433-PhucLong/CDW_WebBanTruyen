import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoneyBill } from '@fortawesome/free-solid-svg-icons'
import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'
import { orderService } from '../../services/orderService'
import { voucherService } from '../../services/voucherService'

const Checkout: React.FC = () => {
  const navigate = useNavigate()
  const { cart, clearCart } = useCart()
  const { user } = useAuth()

  // Form giao hàng
  const [fullName, setFullName] = useState(
    `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
  )
  const [phone, setPhone] = useState(user?.phoneNumber || '')
  const [address, setAddress] = useState('')
  const [note, setNote] = useState('')

  // Voucher
  const [voucherCode, setVoucherCode] = useState('')
  const [voucherMessage, setVoucherMessage] = useState('')
  const [voucherValid, setVoucherValid] = useState(false)
  const [discountPercent, setDiscountPercent] = useState(0)
  const [validatingVoucher, setValidatingVoucher] = useState(false)

  // Submit
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Thêm state lưu lỗi từng field
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string
    phone?: string
    address?: string
  }>({})
  // Tính tiền
  const subtotal = cart?.subtotal || 0
  const shippingFee = cart?.shippingFee || 0
  const discountAmount = Math.floor(subtotal * discountPercent / 100)
  const total = subtotal - discountAmount + shippingFee

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return
    try {
      setValidatingVoucher(true)
      setVoucherMessage('')
      const res = await voucherService.validate(voucherCode.trim())
      const data = res.data
      if (data.isActive) {
        setDiscountPercent(data.discountPercent)
        setVoucherValid(true)
        setVoucherMessage(data.message)
      } else {
        setDiscountPercent(0)
        setVoucherValid(false)
        setVoucherMessage(data.message)
      }
    } catch {
      setVoucherMessage('Lỗi khi kiểm tra voucher')
      setVoucherValid(false)
    } finally {
      setValidatingVoucher(false)
    }
  }

  // Validate số điện thoại VN: bắt đầu bằng 0, đủ 10 số
  const validatePhone = (value: string): string | undefined => {
    if (!value.trim()) return 'Vui lòng không bỏ trống'
    const phoneRegex = /^0\d{9}$/
    if (!phoneRegex.test(value.trim())) {
      return 'Số điện thoại không hợp lệ (phải đủ 10 số, bắt đầu bằng 0)'
    }
    return undefined
  }

  // Validate field bắt buộc đơn giản
  const validateRequired = (value: string): string | undefined => {
    if (!value.trim()) return 'Vui lòng không bỏ trống'
    return undefined
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate từng field, gom lỗi vào object
    const errors: typeof fieldErrors = {
      fullName: validateRequired(fullName),
      phone: validatePhone(phone),
      address: validateRequired(address),
    }
    setFieldErrors(errors)

    // Nếu có bất kỳ lỗi nào thì dừng lại, không submit
    const hasError = Object.values(errors).some(msg => msg !== undefined)
    if (hasError) {
      setError('Vui lòng kiểm tra lại thông tin giao hàng')
      return
    }

    if (!cart || cart.items.length === 0) {
      setError('Giỏ hàng trống')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      const res = await orderService.createOrder({
        shippingAddress: `${fullName} - ${phone} - ${address}`,
        paymentMethod: 'COD',
        note: note.trim() || undefined,
        voucherCode: voucherValid ? voucherCode.trim() : undefined,
      })

      await clearCart()
      navigate('/orders', {
        state: { message: `Đặt hàng thành công! Mã đơn: #${res.data.orderId}` }
      })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Giỏ hàng trống</h2>
        <button onClick={() => navigate('/manga')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700">
          Tiếp tục mua sắm
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Thanh toán</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Cột trái */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Thông tin giao hàng</h2>
              <div className="space-y-4">
                {/* Họ và tên */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => {
                      setFullName(e.target.value)
                      // Xoá lỗi khi người dùng bắt đầu gõ lại
                      if (fieldErrors.fullName) {
                        setFieldErrors(prev => ({ ...prev, fullName: undefined }))
                      }
                    }}
                    placeholder="Nguyễn Văn A"
                    className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1
                      ${fieldErrors.fullName
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`}
                  />
                  {fieldErrors.fullName && (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors.fullName}</p>
                  )}
                </div>

                {/* Số điện thoại */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => {
                      // Chỉ cho nhập số
                      const val = e.target.value.replace(/\D/g, '')
                      setPhone(val)
                      if (fieldErrors.phone) {
                        setFieldErrors(prev => ({ ...prev, phone: undefined }))
                      }
                    }}
                    maxLength={10}
                    placeholder="0912345678"
                    className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1
                      ${fieldErrors.phone
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`}
                  />
                  {fieldErrors.phone && (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors.phone}</p>
                  )}
                </div>

                {/* Địa chỉ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ giao hàng *
                  </label>
                  <textarea
                    rows={3}
                    value={address}
                    onChange={e => {
                      setAddress(e.target.value)
                      if (fieldErrors.address) {
                        setFieldErrors(prev => ({ ...prev, address: undefined }))
                      }
                    }}
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                    className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1
                      ${fieldErrors.address
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`}
                  />
                  {fieldErrors.address && (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors.address}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ghi chú
                  </label>
                  <textarea rows={2} value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="Giao giờ hành chính, gọi trước khi giao..."
                    className="w-full rounded-md border border-gray-300 px-3 py-2
                      focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Phương thức thanh toán — y chang zip layout */}
            <div>
              <h2 className="text-xl font-bold mb-4">Phương thức thanh toán</h2>
              <div className="border-2 border-indigo-500 bg-indigo-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <FontAwesomeIcon icon={faMoneyBill}
                    className="h-6 w-6 text-indigo-600 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      Thanh toán khi nhận hàng (COD)
                    </h3>
                    <p className="text-sm text-gray-500">
                      Thanh toán bằng tiền mặt khi nhận hàng
                    </p>
                  </div>
                  <input type="radio" checked readOnly
                    className="h-4 w-4 text-indigo-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải */}
          <div>
            <h2 className="text-xl text-blue-600 font-bold mb-4">Tóm tắt đơn hàng</h2>

            {/* Danh sách sản phẩm */}
            <div className="space-y-3 mb-6">
              {cart.items.map(item => (
                <div key={item.id}
                  className="flex items-center space-x-3 border-b pb-3">
                  <img src={item.coverImage} alt={item.title}
                    className="w-16 h-20 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://via.placeholder.com/64x80?text=No+Image'
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × {item.price?.toLocaleString('vi-VN')} ₫
                    </p>
                  </div>
                  <p className="text-sm font-medium flex-shrink-0">
                    {item.totalPrice?.toLocaleString('vi-VN')} ₫
                  </p>
                </div>
              ))}
            </div>

            {/* Voucher */}
            <div className="mb-4">
              <label className="block text-base font-bold text-indigo-700 mb-2">
                Mã giảm giá
              </label>
              <div className="flex gap-2">
                <input type="text" value={voucherCode}
                  onChange={e => setVoucherCode(e.target.value.toUpperCase())}
                  placeholder="Nhập mã voucher"
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2
                    focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button type="button" onClick={handleApplyVoucher}
                  disabled={validatingVoucher || !voucherCode.trim()}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-md font-semibold
                  hover:bg-indigo-700 disabled:opacity-50 disabled:bg-gray-300 transition-colors">
                  {validatingVoucher ? '...' : 'Áp dụng'}
                </button>
              </div>
              {voucherMessage && (
                <p className={`text-sm mt-1 ${voucherValid ? 'text-green-600' : 'text-red-500'}`}>
                  {voucherMessage}
                </p>
              )}
            </div>

            {/* Tổng tiền */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tạm tính</span>
                <span className='font-medium'>{subtotal.toLocaleString('vi-VN')} ₫</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-sm text-green-600 font-medium">
                  <span>Giảm giá ({discountPercent}%)</span>
                  <span>- {discountAmount.toLocaleString('vi-VN')} ₫</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Phí vận chuyển</span>
                {shippingFee === 0 ? (
                  <span className="text-green-600 font-bold">Miễn phí</span>
                ) : (
                  <span>{shippingFee.toLocaleString('vi-VN')} ₫</span>
                )}
              </div>
              <div className="border-t-2 border-blue-700 pt-3 flex justify-between items-center">
                <span className="font-bold">Tổng cộng</span>
                <span className="font-bold text-2xl text-red-500">
                  {total.toLocaleString('vi-VN')} ₫
                </span>
              </div>
            </div>

            {/* Nút xác nhận */}
            <button type="submit" disabled={isSubmitting}
              className="mt-4 w-full bg-indigo-600 text-white py-3 px-4 rounded-md
                font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2
                focus:ring-offset-2 focus:ring-indigo-500
                disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent
                    rounded-full animate-spin" />
                  Đang đặt hàng...
                </span>
              ) : 'Xác nhận đặt hàng'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Checkout