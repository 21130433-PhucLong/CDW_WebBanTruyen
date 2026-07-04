import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MangaCard from '../components/common/MangaCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import api from '../services/api'
import type { Manga } from '../models/types'

const Wishlist: React.FC = () => {
  const [items, setItems] = useState<Manga[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        // Endpoint GET /api/wishlist đã có sẵn từ Ngày 10
        const res = await api.get<Manga[]>('/wishlist')
        setItems(res.data)
      } catch (err) {
        console.error('Lỗi lấy wishlist:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchWishlist()
  }, [])

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Sản phẩm yêu thích
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">🤍</p>
          <p className="text-gray-600 text-lg font-medium mb-2">
            Chưa có sản phẩm yêu thích
          </p>
          <p className="text-gray-400 text-sm mb-6">
            Nhấn vào biểu tượng trái tim trên sản phẩm để thêm vào đây
          </p>
          <Link to="/manga"
            className="inline-block bg-indigo-600 text-white px-6 py-3
              rounded-md hover:bg-indigo-700 transition-colors">
            Khám phá sản phẩm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3
          lg:grid-cols-4 gap-5 p-1">
          {items.map(manga => (
            <MangaCard key={manga.id} manga={manga} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Wishlist