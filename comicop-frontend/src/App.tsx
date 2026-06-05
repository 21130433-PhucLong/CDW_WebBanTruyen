import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import PrivateRoute from './components/common/PrivateRoute'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Home from './pages/Home'
import Manga from './pages/Manga'
import MangaDetail from './pages/MangaDetail'
import Search from './pages/Search'
import AuthorDetail from './pages/AuthorDetail'
import MangaNews from './pages/MangaNews'
// Các trang còn lại vẫn là placeholder — sẽ thay dần từng ngày

const Cart = () => <div style={{padding:'2rem'}}>🛒 Giỏ hàng </div>
const Checkout = () => <div style={{padding:'2rem'}}>💳 Thanh toán </div>
const OrderHistory = () => <div style={{padding:'2rem'}}>📋 Lịch sử đơn </div>
const Profile = () => <div style={{padding:'2rem'}}>👤 Hồ sơ </div>
const Admin = () => <div style={{padding:'2rem'}}>⚙️ Admin</div>

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes — ai cũng vào được */}
        <Route index element={<Home />} />
        <Route path="manga" element={<Manga />} />
        <Route path="manga/:id" element={<MangaDetail />} />
        <Route path="search" element={<Search />} />
        <Route path="author/:id" element={<AuthorDetail />} />
        <Route path="news" element={<MangaNews />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Private routes — cần đăng nhập */}
        {/* PrivateRoute kiểm tra user, nếu chưa login → redirect /login */}
        <Route path="cart" element={
          <PrivateRoute><Cart /></PrivateRoute>
        } />
        <Route path="checkout" element={
          <PrivateRoute><Checkout /></PrivateRoute>
        } />
        <Route path="profile" element={
          <PrivateRoute><Profile /></PrivateRoute>
        } />
        <Route path="orders" element={
          <PrivateRoute><OrderHistory /></PrivateRoute>
        } />
        <Route path="admin" element={
          <PrivateRoute><Admin /></PrivateRoute>
        } />
      </Route>
    </Routes>
  )
}

export default App