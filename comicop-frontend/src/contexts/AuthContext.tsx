import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../models/User';
import { authService, mapAccountDtoToUser } from '../services/authService';

// Định nghĩa kiểu dữ liệu của AuthContext
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    username: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State lưu thông tin user đang đăng nhập
  const [user, setUser] = useState<User | null>(null);
  // isLoading = true khi đang kiểm tra token lúc app khởi động
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Khi app khởi động: kiểm tra localStorage có token không
  // Nếu có → gọi API lấy thông tin user → tự động đăng nhập lại
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await authService.getCurrentUser();
          setUser(mapAccountDtoToUser(response.data));
        }
      } catch (error) {
        // Token hết hạn hoặc lỗi → xoá token
        localStorage.removeItem('token');
      } finally {
        // Dù thành công hay lỗi đều tắt loading
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Hàm đăng nhập
  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await authService.login(email, password);
      const { user, token } = response.data;
      // Lưu token vào localStorage để dùng cho các request sau
      localStorage.setItem('token', token);
      setUser(mapAccountDtoToUser(user));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Đăng nhập thất bại');
      throw error;
    }
  };

  // Hàm đăng ký
  const register = async (data: {
    email: string;
    password: string;
    username: string;
    firstName: string;
    lastName: string;
  }) => {
    try {
      setError(null);
      const response = await authService.register(data);
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      setUser(mapAccountDtoToUser(user));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Đăng ký thất bại');
      throw error;
    }
  };

  // Hàm đăng xuất
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    } finally {
      // Dù API lỗi vẫn xoá token local và reset user
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  // Hàm cập nhật profile
  const updateProfile = async (data: Partial<User>) => {
    try {
      setError(null);
      const response = await authService.updateProfile(data);
      setUser(mapAccountDtoToUser(response.data));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Cập nhật thất bại');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      error,
      login,
      register,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook để dùng AuthContext trong bất kỳ component nào
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth phải được dùng trong AuthProvider');
  }
  return context;
};