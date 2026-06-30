import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import LoadingSpinner from '../components/common/LoadingSpinner'

const Cart: React.FC = () => {
  const { cart, isLoading, updateQuantity, removeFromCart } = useCart()
  const navigate = useNavigate()
  const [removingId, setRemovingId] = useState<number | null>(null)

  // Xử lý đổi số lượng
  const handleQuantityChange = async (itemId: number, newQty: number) => {
    if (newQty < 1) return
    try {
      await updateQuantity(itemId, newQty)
    } catch (err) {
      console.error('Lỗi cập nhật số lượng:', err)
    }
  }

  // Xử lý xoá item
  const handleRemoveItem = async (itemId: number) => {
    if (!window.confirm('Bạn có chắc muốn xoá sản phẩm này?')) return
    try {
      setRemovingId(itemId)
      await removeFromCart(itemId)
    } catch (err) {
      console.error('Lỗi xoá sản phẩm:', err)
    } finally {
      setRemovingId(null)
    }
  }

  if (isLoading) return <LoadingSpinner />

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Giỏ hàng trống</h2>
        <p className="text-gray-600 mb-8">
          Bạn chưa có sản phẩm nào trong giỏ hàng.
        </p>
        <Link
          to="/manga"
          className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Giỏ hàng</h1>
      {/* Dòng thông báo tổng số sản phẩm — cộng dồn quantity, không phải số dòng */}
      <p className="text-gray-600 mb-8">
        Bạn đang có{' '}
        <span className="font-bold text-red-600">
          {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
        </span>{' '}
        sản phẩm trong giỏ hàng
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 border border-gray-200 rounded-lg p-4"
              >
                {/* Ảnh sản phẩm */}
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-24 h-36 object-cover rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/96x144?text=No+Image'
                  }}
                />

                <div className="flex-1">
                  <Link
                    to={`/manga/${item.mangaId}`}
                    className="text-lg font-medium hover:text-indigo-600"
                  >
                    {item.title}
                  </Link>
                  <p className="text-gray-500">
                    {item.authorName}
                  </p>
                  <p className="text-indigo-600 font-medium">
                    {(item.price || 0).toLocaleString('vi-VN')} ₫
                  </p>

                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 border-x border-gray-300">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={removingId === item.id}
                      className="text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                      {removingId === item.id ? 'Đang xoá...' : 'Xoá'}
                    </button>
                  </div>
                </div>

                {/* Thành tiền */}
                <div className="text-right min-w-[100px]">
                  <p className="font-semibold text-gray-900">
                    {(item.totalPrice || 0).toLocaleString('vi-VN')} ₫
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="border border-gray-200 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold">Tổng đơn hàng</h2>

            <div className="flex justify-between py-2 border-b border-gray-200">
              <span>Tạm tính</span>
              <span>
                {cart.subtotal?.toLocaleString('vi-VN')} ₫
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-200">
              <span>Phí vận chuyển</span>
              {cart.shippingFee === 0 ? (
                <span className="text-green-600 font-medium">Miễn phí</span>
              ) : (
                <span>{cart.shippingFee?.toLocaleString('vi-VN')} ₫</span>
              )}
            </div>

            {/* Thông báo miễn phí ship */}
            {cart.subtotal < 150000 && (
              <p className="text-sm text-gray-500">
                Mua thêm{' '}
                <span className="text-indigo-600 font-medium">
                  {(150000 - cart.subtotal).toLocaleString('vi-VN')} ₫
                </span>{' '}
                để được miễn phí vận chuyển
              </p>
            )}

            <div className="flex justify-between py-2 font-bold text-lg">
              <span>Tổng cộng</span>
              <span className="text-red-500">
                {cart.total?.toLocaleString('vi-VN')} ₫
              </span>
            </div>

            {/* Nút đặt hàng */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
            >
              Tiến hành thanh toán
            </button>

            <Link
              to="/manga"
              className="block text-center text-indigo-600 hover:text-indigo-700 mt-3"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart