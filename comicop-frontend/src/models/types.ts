// types.ts — khai báo tất cả TypeScript interface dùng chung trong toàn app
// Các interface này map với data trả về từ Backend API

export interface Author {
  id: number
  name: string
  image: string
  biography: string
  mangaCount: number
}

export interface Category {
  id: number
  name: string
  count: number
}

export interface Chapter {
  id: number
  number: number
  title: string
}

export interface Review {
  id: number
  userName: string
  rating: number
  comment: string
  date: string
}

// Interface Manga — map với ProductDto bên backend
// Thêm publisher, pages, publishYear so với zip gốc (chức năng nhà sách)
export interface Manga {
  id: number
  title: string
  description: string
  coverImage: string      // = imageUrl trong ProductDto
  price: number
  rating: number          // = averageRating trong ProductDto
  author: Author
  categories: Category[]
  status: 'ongoing' | 'completed' | 'hiatus'
  releaseYear: number
  isNew?: boolean;
  reviews: Review[]
  // Thêm mới — thông tin sách vật lý
  publisher?: string      // Nhà xuất bản
  pages?: number          // Số trang
  publishYear?: number    // Năm xuất bản
  isFeatured?: boolean    // Có phải sản phẩm nổi bật không
  stock?: number          // Số lượng tồn kho
  soldCount?: number      // Số lượng đã bán
  images?: string[]       // Gallery nhiều ảnh — thêm mới
}

export interface CartItem {
  id: number
  manga: Manga
  quantity: number
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  shippingFee: number
  total: number
}

// Interface User trong types.ts — dùng cho local state
// Khác với User trong models/User.ts — cái đó dùng cho AuthContext
export interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  phoneNumber?: string
  addresses: Address[]
  // Thêm mới — danh sách manga yêu thích
  wishlist?: number[]
}

export interface Address {
  id: number
  fullName: string
  phoneNumber: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
}

// LoginCredentials — dùng trong trang Login
export interface LoginCredentials {
  email: string
  password: string
}

// RegisterData — dùng trong trang Register
export interface RegisterData {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}