import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

// Sidebar trái cố định + Outlet render nội dung trang con bên phải
const ProfileLayout: React.FC = () => {
  const { user } = useAuth()
  const location = useLocation()

  // Danh sách menu sidebar — dùng path để biết item nào đang active
  const menuItems = [
    { path: '/profile', label: 'Hồ sơ cá nhân', icon: '👤' },
    { path: '/orders', label: 'Đơn hàng của tôi', icon: '📦' },
    { path: '/wishlist', label: 'Yêu thích', icon: '❤️' },
    { path: '/profile/change-password', label: 'Đổi mật khẩu', icon: '🔒' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Sidebar */}
        <aside className="md:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200
            shadow-sm p-6 text-center sticky top-24">

            {/* Avatar lớn */}
            <img
              src={user?.avatar || 'https://via.placeholder.com/100?text=Avatar'}
              alt={user?.username}
              className="w-24 h-24 rounded-full mx-auto object-cover
                border-4 border-indigo-100"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://via.placeholder.com/100?text=Avatar'
              }}
            />
            <p className="font-bold text-gray-800 mt-3">{user?.username}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>

            {/* Menu điều hướng */}
            <nav className="mt-6 space-y-1 text-left">
              {menuItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg
                    text-sm font-medium transition-colors
                    ${location.pathname === item.path
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Nội dung trang con */}
        <div className="md:col-span-3">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default ProfileLayout