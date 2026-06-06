import type { Manga } from './Manga'

// CartItemDto — map với CartItemDto.java backend (field phẳng)
export interface CartItemDto {
  id: number
  mangaId: number
  title: string
  coverImage: string
  price: number
  authorName: string
  quantity: number
  totalPrice: number
}

// CartDto — map với CartDto.java backend
export interface CartDto {
  cartId: number
  items: CartItemDto[]
  subtotal: number
  shippingFee: number
  total: number
}

// CartItem — dùng cho guest chưa đăng nhập (local state)
export interface CartItem {
  id: number
  manga: Manga
  quantity: number
}

// Cart — dùng cho guest
export interface Cart {
  items: CartItem[]
  subtotal: number
  shippingFee: number
  total: number
}

// CheckoutDetails — gửi lên khi đặt hàng
export interface CheckoutDetails {
  shippingAddress: string
  paymentMethod: 'cod'
  note?: string
  voucherCode?: string
}

// Order — trả về sau khi đặt hàng
export interface Order {
  orderId: number
  status: string
  totalPrice: number
  shippingAddress: string
  paymentMethod: string
  note?: string
  createdAt: string
  orderDetails: {
    orderDetailId: number
    productId: number
    productTitle: string
    productImage: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }[]
}