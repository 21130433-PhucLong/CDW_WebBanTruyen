import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { orderService } from '../../services/orderService'
import type { Order } from '../../models/Cart'
import { toast } from 'react-toastify'

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const location = useLocation()

  // Nhận thông báo đặt hàng thành công từ Checkout
  const successMessage = location.state?.message

  const fetchOrders = async () => {
    try {
      const res = await orderService.getOrders()
      setOrders(res.data)
    } catch (err) {
      console.error('Lỗi lấy đơn hàng:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // Map status từ backend → tiếng Việt
  const getStatusInfo = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return { label: 'Chờ xử lý', className: 'bg-yellow-100 text-yellow-800' }
      case 'PROCESSING':
        return { label: 'Đang xử lý', className: 'bg-blue-100 text-blue-800' }
      case 'SHIPPED':
        return { label: 'Đang giao', className: 'bg-purple-100 text-purple-800' }
      case 'DELIVERED':
        return { label: 'Đã giao', className: 'bg-green-100 text-green-800' }
      case 'CANCELLED':
        return { label: 'Đã huỷ', className: 'bg-red-100 text-red-800' }
      case 'COMPLETED':
        return { label: 'Hoàn thành', className: 'bg-green-100 text-green-800' }
      default:
        return { label: status || 'Không rõ', className: 'bg-gray-100 text-gray-600' }
    }
  }

  const handleCancelOrder = async (orderId: number) => {
    if (!window.confirm('Bạn có chắc muốn huỷ đơn hàng này?')) return

    try {
      await orderService.cancelOrder(orderId)
      toast.success('Đã huỷ đơn hàng!')
      fetchOrders()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể huỷ đơn')
    }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Lịch sử đơn hàng</h1>

      {/* Thông báo đặt hàng thành công */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          ✅ {successMessage}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Bạn chưa có đơn hàng nào.</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Mã đơn hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ngày đặt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tổng tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Chi tiết
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.orderId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    #{order.orderId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString('vi-VN')
                      : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.totalPrice?.toLocaleString('vi-VN')} ₫
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(() => {
                      const statusInfo = getStatusInfo(order.status)

                      return (
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${statusInfo.className}`}
                          >
                            {statusInfo.label}
                          </span>

                          {order.status?.toUpperCase() === 'PENDING' && (
                            <button
                              onClick={() => handleCancelOrder(order.orderId)}
                              className="text-xs text-red-600 border border-red-200 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                            >
                              Huỷ đơn
                            </button>
                          )}
                        </div>
                      )
                    })()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setSelectedOrder(
                        selectedOrder?.orderId === order.orderId ? null : order)}
                      className="text-indigo-600 hover:text-indigo-900">
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Chi tiết đơn hàng mở rộng */}
      {selectedOrder && (
        <div className="mt-6 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4">
            Chi tiết đơn #{selectedOrder.orderId}
          </h2>
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Địa chỉ:</span>{' '}
            {selectedOrder.shippingAddress}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            <span className="font-medium">Thanh toán:</span>{' '}
            {selectedOrder.paymentMethod === 'COD'
              ? 'Thanh toán khi nhận hàng' : selectedOrder.paymentMethod}
          </p>
          <div className="space-y-3">
            {selectedOrder.orderDetails?.map(detail => (
              <div key={detail.orderDetailId}
                className="flex items-center space-x-3 border-b pb-3">
                <img src={detail.productImage} alt={detail.productTitle}
                  className="w-16 h-20 object-cover rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/64x80?text=No+Image'
                  }}
                />
                <div className="flex-1">
                  <p className="font-medium">{detail.productTitle}</p>
                  <p className="text-sm text-gray-500">
                    {detail.quantity} × {detail.unitPrice?.toLocaleString('vi-VN')} ₫
                  </p>
                </div>
                <p className="font-medium">
                  {detail.totalPrice?.toLocaleString('vi-VN')} ₫
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderHistory