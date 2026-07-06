import api from './api';
import type { User, AuthResponse } from '../models/User';


// Hàm chuyển AccountDto từ backend sang User interface của frontend
export const mapAccountDtoToUser = (dto: any):User => ({
  id: dto.userID,
  username: dto.userName || dto.username || '',
  email: dto.email || '',
  firstName: dto.firstName || '',
  lastName: dto.lastName || '',
  avatar: dto.img || undefined,
  phoneNumber: dto.phone || undefined,
  addresses: [],
  orderHistory: [],
  wishlist: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  role: dto.role?.toLowerCase() === 'admin' ? 'admin' : 'user',
})

// authService — tất cả API call liên quan đến xác thực
// Dùng instance api đã có interceptor JWT tự động
export const authService = {

  // Đăng nhập — POST /api/auth/login
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),

  // Đăng ký — POST /api/auth/register
  register: (data: {
    email: string;
    password: string;
    username: string;
    firstName: string;
    lastName: string;
  }) => api.post<AuthResponse>('/auth/register', data),

  // Đăng xuất — POST /api/auth/logout
  logout: () => api.post('/auth/logout'),

  // Đổi mật khẩu — POST /api/auth/change-password
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/auth/change-password', { currentPassword, newPassword }),

  // Lấy thông tin user hiện tại — GET /api/auth/me
  // Dùng token trong localStorage (tự gắn qua interceptor)
  getCurrentUser: () => api.get<User>('/auth/me'),

  // Cập nhật profile — PUT /api/auth/me
  updateProfile: (data: Partial<User>) =>
    api.put<User>('/auth/me', {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phoneNumber
    }),

  // upload avatar
  uploadAvatar: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    console.log(formData.get("file"));
    return api.post<any>('/auth/avatar', formData); 
  },
};