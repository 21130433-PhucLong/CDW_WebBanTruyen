import React from 'react'

// LoadingSpinner — hiển thị khi đang gọi API
// Dùng ở mọi trang khi isLoading = true
// Tránh UI trắng trơn trong khi chờ dữ liệu
const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Vòng xoay — Tailwind animate-spin */}
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="text-gray-500 text-sm">Đang tải...</p>
      </div>
    </div>
  )
}

export default LoadingSpinner