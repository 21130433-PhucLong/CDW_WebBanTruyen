import React from 'react'
import { Link } from 'react-router-dom'
import type { Manga } from '../../models/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { useCart } from '../../contexts/CartContext'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { toast } from 'react-toastify'

interface MangaCardProps {
  manga: Manga
}

// Hàm xác định badge hiển thị — ưu tiên theo thứ tự quan trọng
const getBadge = (manga: Manga) => {
  // Hết hàng — ưu tiên cao nhất, quan trọng nhất với người mua
  if (manga.stock !== undefined && manga.stock === 0) {
    return { text: 'Hết hàng', className: 'bg-gray-100 text-gray-600' }
  }
  // Bán chạy — soldCount cao
  if (manga.soldCount && manga.soldCount >= 400) {
    return { text: 'Bán chạy', className: 'bg-orange-100 text-orange-700' }
  }
  // Sản phẩm mới — tạo trong 30 ngày gần nhất
  if (manga.isNew) {
    return { text: 'Mới', className: 'bg-blue-100 text-blue-700' }
  }
  // Mặc định — còn hàng bình thường
  return { text: 'Còn hàng', className: 'bg-green-100 text-green-700' }
}

const MangaCard: React.FC<MangaCardProps> = ({ manga }) => {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [addingQuick, setAddingQuick] = React.useState(false)
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
        <h3 className="text-xs font-semibold text-indigo-700 leading-snug
          line-clamp-2 min-h-[2.6rem]">
          {/* line-clamp-2: tối đa 2 dòng, quá thì ...
              min-h-[2.6rem]: luôn chiếm đúng 2 dòng dù tên ngắn 1 dòng */}
          <Link to={`/manga/${manga.id}`} className="hover:underline">
            {manga.title}
          </Link>
        </h3>

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
          {(() => {
            const badge = getBadge(manga)
            return (
              <span className={`inline-block mt-3 text-s font-medium px-2 py-1
                rounded-full ${badge.className}`}>
                {badge.text}
              </span>
            )
          })()}
        </div>
      </div>

      <div className="px-4 pb-4 mt-auto">
        <button
          onClick={async (e) => {
            e.preventDefault() // không navigate vào trang chi tiết
            if (!user) {
              toast.info('Vui lòng đăng nhập để thêm vào giỏ hàng')
              navigate('/login')
              return
            }
            try {
              setAddingQuick(true)
              await addToCart(manga.id, 1)
              toast.success(`Đã thêm "${manga.title}" vào giỏ!`)
            } catch (err: any){
              toast.error(err.response?.data?.message || 'Không thể thêm vào giỏ hàng')
            } finally{
              setAddingQuick(false)
            }
          }}
          disabled ={addingQuick}
          className="w-full py-2 bg-blue-600 text-white text-sm font-medium
           rounded-lg hover:bg-blue-800 active:bg-indigo-800 transition-colors"
        >
          {addingQuick ? 'Đang thêm...' : '+ Thêm vào giỏ'}
        </button>
      </div>

    </div>
  )
}

export default MangaCard