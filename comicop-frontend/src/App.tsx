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
import Cart from './pages/Cart'
import Checkout from './pages/checkout/Checkout'
import OrderHistory from './pages/user/OrderHistory'
import ScrollToTop from './components/common/ScrollToTop'
import ProfileLayout from './components/Layout/ProfileLayout'
import Profile from './pages/user/Profile'
import ChangePassword from './pages/user/ChangePassword'
import Wishlist from './pages/Wishlist'
import AddressBook from './pages/user/AddressBook'
import PaymentSimulation from './pages/checkout/PaymentSimulation'


const Admin = () => <div style={{padding:'2rem'}}>⚙️ Admin</div>

const App: React.FC = () => {
  return (
    <>
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
          <Route path="wishlist" element={
            <PrivateRoute><Wishlist /></PrivateRoute>
          } />
         <Route path="profile" element={
            <PrivateRoute><ProfileLayout /></PrivateRoute>
          }>
            <Route index element={<Profile />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="address" element={<AddressBook />} />
          </Route>
         <Route path="orders" element={
           <PrivateRoute><ProfileLayout /></PrivateRoute>
         }>
           <Route index element={<OrderHistory />} />
         </Route>
         <Route path="payment/:orderId" element={
            <PrivateRoute><PaymentSimulation /></PrivateRoute>
          } />
          <Route path="admin" element={
            <PrivateRoute><Admin /></PrivateRoute>
          } />
        </Route>
      </Routes>
      
      <ScrollToTop />
    </>
  )
}

export default App