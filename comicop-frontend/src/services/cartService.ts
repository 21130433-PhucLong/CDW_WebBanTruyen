import api from './api';
import type { Cart, Order, CheckoutDetails } from '../models/Cart';

export const cartService = {
  // Cart operations
  getCart: () => api.get<Cart>('/cart'),

  addToCart: (mangaId: number, quantity: number = 1) =>
    api.post<Cart>('/cart/items', { mangaId, quantity }),

  updateQuantity: (itemId: number, quantity: number) =>
    api.put<Cart>(`/cart/items/${itemId}`, { quantity }),

  removeFromCart: (itemId: number) =>
    api.delete(`/cart/items/${itemId}`),

  clearCart: () => api.delete('/cart'),

  // Tính phí vận chuyển theo địa chỉ
  calculateShipping: (address: CheckoutDetails['shippingAddress']) =>
    api.post<{ shippingFee: number }>('/cart/shipping', address),

  // Đặt hàng
  checkout: (checkoutDetails: CheckoutDetails) =>
    api.post<Order>('/orders', checkoutDetails),

  // Lịch sử đơn hàng
  getOrders: () => api.get<Order[]>('/orders'),
  getOrder: (orderId: number) => api.get<Order>(`/orders/${orderId}`),
  cancelOrder: (orderId: number) =>
    api.post(`/orders/${orderId}/cancel`),

  // Admin
  getAllOrders: () => api.get<Order[]>('/admin/orders'),
  updateOrderStatus: (orderId: number, status: Order['status']) =>
    api.put(`/admin/orders/${orderId}/status`, { status }),

  // Thanh toán
  processPayment: (orderId: number, paymentDetails: {
    method: CheckoutDetails['paymentMethod'];
    token?: string;
  }) => api.post(`/orders/${orderId}/payment`, paymentDetails),

  getShippingStatus: (orderId: number) =>
    api.get(`/orders/${orderId}/shipping`),
};