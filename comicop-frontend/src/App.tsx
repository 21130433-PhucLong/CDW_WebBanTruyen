import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import PrivateRoute from './components/common/PrivateRoute'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Home from './pages/Home'
import Manga from './pages/Manga'
// Các trang còn lại vẫn là placeholder — sẽ thay dần từng ngày

const MangaDetail = () => <div style={{padding:'2rem'}}>📖 Chi tiết manga — Ngày 9</div>
const Cart = () => <div style={{padding:'2rem'}}>🛒 Giỏ hàng — Ngày 10</div>
const Search = () => <div style={{padding:'2rem'}}>🔍 Tìm kiếm — Ngày 9</div>
const Checkout = () => <div style={{padding:'2rem'}}>💳 Thanh toán — Ngày 13</div>
const OrderHistory = () => <div style={{padding:'2rem'}}>📋 Lịch sử đơn — Ngày 13</div>
const Profile = () => <div style={{padding:'2rem'}}>👤 Hồ sơ — Ngày 15</div>
const ReadManga = () => <div style={{padding:'2rem'}}>📄 Đọc thử — Ngày 9</div>
const AuthorDetail = () => <div style={{padding:'2rem'}}>✍️ Tác giả — Ngày 9</div>
const MangaNews = () => <div style={{padding:'2rem'}}>📰 Tin tức — Ngày 9</div>
const Admin = () => <div style={{padding:'2rem'}}>⚙️ Admin — Ngày 17</div>

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes — ai cũng vào được */}
        <Route index element={<Home />} />
        <Route path="manga" element={<Manga />} />
        <Route path="manga/:id" element={<MangaDetail />} />
        <Route path="manga/:mangaId/chapter/:chapterId" element={<ReadManga />} />
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