import React from 'react'
import { Link } from 'react-router-dom'
import type { Manga } from '../../models/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

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
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Ảnh bìa — click vào → chi tiết manga */}
      <Link to={`/manga/${manga.id}`}>
        <img
          src={manga.coverImage}
          alt={manga.title}
          className="w-full h-64 object-cover"
          loading="lazy"
          // Ảnh mặc định nếu link bị lỗi
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://via.placeholder.com/200x280?text=No+Image'
          }}
        />
      </Link>

      <div className="p-4">
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
        <div className="flex items-center mt-2">
          <FontAwesomeIcon icon={faStar} className="text-yellow-400 mr-1" />
          <span className="text-sm text-gray-700">
            {manga.rating?.toFixed(1) || '0.0'}
          </span>
        </div>

        {/* Giá + trạng thái */}
        <div className="mt-2">
          <span className="block text-indigo-600 font-medium">
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
    </div>
  )
}

export default MangaCard