import React from 'react'
import { Link } from 'react-router-dom'
import type { Manga } from '../../models/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { useCart } from '../../contexts/CartContext'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

interface MangaCardProps {
  manga: Manga
}

// Hàm trả về class CSS dựa vào trạng thái manga
const getStatusStyle = (status: string) => {
  switch (status) {
    case 'ongoing':   return 'bg-green-100 text-green-800'
    case 'completed': return 'bg-blue-100 text-blue-800'
    default:          return 'bg-gray-100 text-gray-800'
  }
}

// Hàm trả về nhãn tiếng Việt
const getStatusLabel = (status: string) => {
  switch (status) {
    case 'ongoing':   return 'Đang tiến hành'
    case 'completed': return 'Hoàn thành'
    default:          return 'Tạm ngưng'
  }
}

const MangaCard: React.FC<MangaCardProps> = ({ manga }) => {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-indigo-300
        shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full">
      {/* Ảnh bìa — click vào → chi tiết manga */}
      <Link to={`/manga/${manga.id}`}>
        <img
          src={manga.coverImage}
          alt={manga.title}
          className="w-full h-64 object-contain"
          loading="lazy"
          // Ảnh mặc định nếu link bị lỗi
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://via.placeholder.com/200x280?text=No+Image'
          }}
        />
      </Link>

      <div className="p-4 flex flex-col flex-1">
        {/* Tên manga */}
        <Link
          to={`/manga/${manga.id}`}
          className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2"
        >
          {manga.title}
        </Link>

        {/* Tên tác giả */}
        <p className="text-sm text-gray-600 mt-1">
          {manga.author?.name || 'Không rõ'}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1">
            <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-xs" />
            <span className="text-sm text-gray-700">
              {manga.rating?.toFixed(1) || '0.0'}
            </span>
          </div>
          {/* Đã bán — chỉ hiện nếu > 0 */}
          {manga.soldCount !== undefined && manga.soldCount > 0 && (
            <>
              <span className="text-gray-300 text-xs">|</span>
              <span className="text-xs text-gray-500">
                Đã bán {manga.soldCount.toLocaleString('vi-VN')}
              </span>
            </>
          )}
        </div>

        {/* Giá + trạng thái */}
        <div className="mt-2">
          <span className="block text-red-500 font-medium">
            {manga.price?.toLocaleString('vi-VN')} ₫
          </span>
          <span
            className={`inline-block mt-1 text-sm px-2 py-1 rounded
              ${getStatusStyle(manga.status)}`}
          >
            {getStatusLabel(manga.status)}
          </span>
        </div>
      </div>

      <div className="px-4 pb-4 mt-auto">
        <button
          onClick={async (e) => {
            e.preventDefault() // không navigate vào trang chi tiết
            if (!user) {
              alert('Vui lòng đăng nhập để thêm vào giỏ hàng')
              navigate('/login')
              return
            }
            try {
              await addToCart(manga.id, 1)
              alert(`Đã thêm "${manga.title}" vào giỏ!`)
            } catch (err: any){
              alert(err.response?.data?.message || 'Không thể thêm vào giỏ hàng')
            }
          }}
          className="w-full py-2 bg-blue-600 text-white text-sm font-medium
           rounded-lg hover:bg-blue-800 active:bg-indigo-800 transition-colors"
        >
          + Thêm vào giỏ
        </button>
      </div>

    </div>
  )
}

export default MangaCard