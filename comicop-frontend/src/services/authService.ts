import api from './api';
import type { User, AuthResponse } from '../models/User';

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
    api.put<User>('/auth/me', data),
};