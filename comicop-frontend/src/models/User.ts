

// Interface Address — địa chỉ giao hàng của user
export interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

// Interface OrderHistory — lịch sử đơn hàng
export interface OrderHistory {
  id: number;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: {
    mangaId: number;
    quantity: number;
    price: number;
  }[];
}

// Interface User — thông tin tài khoản
// Map với AccountDto bên backend
export interface User {
  id: number;        // = userID trong AccountDto
  email: string;
  username: string;  // = userName trong AccountDto
  firstName: string;
  lastName: string;
  avatar?: string;   // = img trong AccountDto
  phoneNumber?: string;
  addresses: Address[];
  orderHistory: OrderHistory[];
  wishlist: number[]; // Danh sách manga ID yêu thích — thêm mới
  createdAt: string;
  updatedAt: string;
  role: 'user' | 'admin'; // = role trong AccountDto
}

// AuthResponse — response trả về sau login/register
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string; // Optional vì backend chưa implement refresh token
}