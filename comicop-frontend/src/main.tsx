// Entry point của toàn bộ React app
// Thứ tự bọc Provider quan trọng:
// AuthProvider ngoài cùng → CartProvider bên trong
// vì CartContext cần dùng useAuth() từ AuthContext.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

// AuthProvider — quản lý trạng thái đăng nhập toàn app
// Sẽ tạo file này đầy đủ ở Ngày 5
import { AuthProvider } from './contexts/AuthContext.tsx'

// CartProvider — quản lý giỏ hàng toàn app
// Sẽ tạo file này đầy đủ ở Ngày 10
import { CartProvider } from './contexts/CartContext'

// Bootstrap CSS — dùng cho Thymeleaf templates và một số component
import 'bootstrap/dist/css/bootstrap.min.css'

// CSS global của dự án
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            {/* AuthProvider ngoài để CartProvider có thể dùng useAuth() */}
            <AuthProvider>
                <CartProvider>
                    <App />
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
)