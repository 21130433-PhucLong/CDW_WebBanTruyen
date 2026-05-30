// App.tsx — Khai báo toàn bộ routes của dự án
// Layout bọc tất cả routes → Header + Footer tự hiện ở mọi trang
// Outlet trong Layout sẽ render đúng trang theo URL
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'

// Placeholder cho các trang — sẽ thay bằng component thật từng ngày
// Ngày 5:  Login, Register
// Ngày 8:  Home, Manga
// Ngày 9:  MangaDetail, Search, AuthorDetail, MangaNews, ReadManga
// Ngày 10: Cart
// Ngày 13: Checkout, OrderHistory
// Ngày 15: Profile
// Ngày 17: Admin
const Home = () => <div style={{padding:'2rem'}}>🏠 Trang chủ — Ngày 8</div>
const MangaDetail = () => <div style={{padding:'2rem'}}>📖 Chi tiết manga — Ngày 9</div>
const Cart = () => <div style={{padding:'2rem'}}>🛒 Giỏ hàng — Ngày 10</div>
const Login = () => <div style={{padding:'2rem'}}>🔐 Đăng nhập — Ngày 5</div>
const Register = () => <div style={{padding:'2rem'}}>📝 Đăng ký — Ngày 5</div>
const Search = () => <div style={{padding:'2rem'}}>🔍 Tìm kiếm — Ngày 9</div>
const Checkout = () => <div style={{padding:'2rem'}}>💳 Thanh toán — Ngày 13</div>
const OrderHistory = () => <div style={{padding:'2rem'}}>📋 Lịch sử đơn — Ngày 13</div>
const Profile = () => <div style={{padding:'2rem'}}>👤 Hồ sơ — Ngày 15</div>
const Manga = () => <div style={{padding:'2rem'}}>📚 Danh sách manga — Ngày 8</div>
const ReadManga = () => <div style={{padding:'2rem'}}>📄 Đọc thử — Ngày 9</div>
const AuthorDetail = () => <div style={{padding:'2rem'}}>✍️ Tác giả — Ngày 9</div>
const MangaNews = () => <div style={{padding:'2rem'}}>📰 Tin tức — Ngày 9</div>
const Admin = () => <div style={{padding:'2rem'}}>⚙️ Admin — Ngày 17</div>

const App: React.FC = () => {
  return (
      <Routes>
        {/*
        Layout bọc toàn bộ routes
        Mọi trang đều có Header + Footer từ Layout
      */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="manga/:id" element={<MangaDetail />} />
          <Route path="manga/:mangaId/chapter/:chapterId" element={<ReadManga />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="search" element={<Search />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />} />
          <Route path="orders" element={<OrderHistory />} />
          <Route path="manga" element={<Manga />} />
          <Route path="author/:id" element={<AuthorDetail />} />
          <Route path="news" element={<MangaNews />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
  )
}

export default App