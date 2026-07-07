import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { orderService } from '../../services/orderService'
import { useCart } from '../../contexts/CartContext'
import { toast } from 'react-toastify'
import api from '../../services/api'

const PaymentSimulation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { clearCart, fetchCart } = useCart()

  const method = (location.state as any)?.method || 'BANK_TRANSFER'
  const total = (location.state as any)?.total || 0

  const [isConfirming, setIsConfirming] = useState(false)
  const [walletBalance, setWalletBalance] = useState<number | null>(null)

  useEffect(() => {
    api.get('/auth/wallet').then(res => setWalletBalance(res.data)).catch(() => {})
    fetchCart()
  }, [fetchCart])

  const handleConfirm = async () => {
    if (walletBalance !== null && walletBalance < total) {
      toast.error('Số dư không đủ để thanh toán!')
      return
    }

    try {
      setIsConfirming(true)
      await new Promise(resolve => setTimeout(resolve, 800))
      await orderService.confirmPayment(Number(orderId))
      // clearCart chỉ cập nhật UI — backend đã xoá cart từ createOrder rồi
      try { await clearCart() } catch {}
      toast.success('Thanh toán thành công!')
      navigate('/orders', {
        state: { message: `Đặt hàng thành công! Mã đơn: #${orderId}` }
      })
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Xác nhận thanh toán thất bại')
    } finally {
      setIsConfirming(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">

        {method === 'BANK_TRANSFER' ? (
          <>
            <h1 className="text-xl font-bold text-gray-800 mb-1">
              🏦 Chuyển khoản ngân hàng
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Quét mã QR hoặc chuyển khoản theo thông tin dưới đây
            </p>

            {/* QR giả lập — không phải QR thật, chỉ minh hoạ UI */}
            <div className="bg-gray-100 w-48 h-48 mx-auto rounded-lg
              flex items-center justify-center mb-4">
              <span className="text-6xl">📱</span>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Ngân hàng</span>
                <span className="font-medium">Vietcombank</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Số tài khoản</span>
                <span className="font-medium">0123456789</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Chủ tài khoản</span>
                <span className="font-medium">COMICOP STORE</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Nội dung CK</span>
                <span className="font-medium">DH{orderId}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Số tiền</span>
                <span className="text-indigo-600">
                  {total.toLocaleString('vi-VN')} ₫
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Giao diện Momo giả lập */}
            <div className="bg-pink-50 rounded-lg p-6 mb-6">
              <span className="text-5xl">📱</span>
              <h1 className="text-xl font-bold text-pink-600 mt-3">
                Ví Momo
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Số tiền cần thanh toán
              </p>
              <p className="text-3xl font-bold text-pink-600 mt-2">
                {total.toLocaleString('vi-VN')} ₫
              </p>
              <p className="text-xs text-gray-400 mt-3">
                Mã đơn: DH{orderId}
              </p>
            </div>
          </>
        )}

        <button
          onClick={handleConfirm}
          disabled={isConfirming}
          className={`w-full py-3 rounded-md font-semibold text-white
            transition-colors disabled:opacity-50
            ${method === 'MOMO'
              ? 'bg-pink-600 hover:bg-pink-700'
              : 'bg-indigo-600 hover:bg-indigo-700'}`}
        >
          {isConfirming ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white
                border-t-transparent rounded-full animate-spin" />
              Đang xử lý...
            </span>
          ) : (
            method === 'MOMO' ? 'Thanh toán qua Momo' : 'Tôi đã chuyển khoản'
          )}
        </button>

        <p className="text-xs text-gray-400 mt-3">
          * Đây là môi trường demo — không phát sinh giao dịch thật
        </p>
      </div>
    </div>
  )
}

export default PaymentSimulation