import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

interface PrivateRouteProps {
  children: React.ReactNode
}

// PrivateRoute — bảo vệ các trang cần đăng nhập
// Dùng bọc route /cart, /checkout, /profile, /orders trong App.tsx
// Nếu chưa đăng nhập → tự động redirect về /login
// Nếu đang loading (kiểm tra token) → hiện spinner chờ
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth()

  // Đang kiểm tra token trong localStorage → chờ, không redirect vội
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  // Chưa đăng nhập → redirect về /login
  // replace = thay thế history entry hiện tại
  // (nhấn Back không quay về trang bị chặn)
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Đã đăng nhập → render trang bình thường
  return <>{children}</>
}

export default PrivateRoute