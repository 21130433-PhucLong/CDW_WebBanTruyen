// Cart.ts — interface cho giỏ hàng và đặt hàng
import type { Manga } from './Manga';

export interface CartItem {
  id: number;
  manga: Manga;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
}

// CheckoutDetails — thông tin cần khi đặt hàng
export interface CheckoutDetails {
  shippingAddress: {
    fullName: string;
    phoneNumber: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  // COD = thanh toán khi nhận hàng (chức năng chính)
  paymentMethod: 'cod' | 'credit_card' | 'bank_transfer';
  note?: string;
}

// Order extends Cart — đơn hàng có thêm thông tin trạng thái
export interface Order extends Cart {
  id: number;
  orderNumber: string;
  userId: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  checkoutDetails: CheckoutDetails;
  createdAt: string;
  updatedAt: string;
}