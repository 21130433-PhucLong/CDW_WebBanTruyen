import api from './api'
import type { Order } from '../models/Cart'

// Interface cho request tạo đơn hàng
interface CreateOrderRequest {
  shippingAddress: string
  paymentMethod: string
  note?: string
  voucherCode?: string
}

export const orderService = {
  // Tạo đơn hàng mới — POST /api/orders
  createOrder: (data: CreateOrderRequest) =>
    api.post<Order>('/orders', data),

  // Lấy tất cả đơn hàng của user — GET /api/orders
  getOrders: () => api.get<Order[]>('/orders'),

  // Chi tiết 1 đơn hàng — GET /api/orders/{id}
  getOrder: (orderId: number) =>
    api.get<Order>(`/orders/${orderId}`),

  // Huỷ đơn hàng — POST /api/orders/{id}/cancel
  cancelOrder: (orderId: number) =>
    api.post(`/orders/${orderId}/cancel`),

  // Thêm vào object orderService
  confirmPayment: (orderId: number) =>
    api.post<Order>(`/orders/${orderId}/confirm-payment`),
}