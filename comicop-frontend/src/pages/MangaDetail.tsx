import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faHeart } from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartOutline } from '@fortawesome/free-regular-svg-icons'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { mangaService } from '../services/mangaService'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import type { Manga } from '../models/types'
import MangaCard from '../components/common/MangaCard'
import api from '../services/api'

const MangaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { user } = useAuth()

  const [manga, setManga] = useState<Manga | null>(null)
  const [relatedManga, setRelatedManga] = useState<Manga[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)

  // 📌 TODO: Ảnh đang xem trong gallery — mặc định là ảnh bìa chính
  const [selectedImage, setSelectedImage] = useState<string>('')

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return
      try {
        setIsLoading(true)
        // Gọi song song: chi tiết manga + manga liên quan
        const [mangaRes, relatedRes] = await Promise.all([
          mangaService.getById(Number(id)),
          mangaService.getRelated(Number(id)),
        ])
        setManga(mangaRes.data)
        setSelectedImage(mangaRes.data.coverImage)
        setRelatedManga(relatedRes.data)
      } catch (err) {
        setError('Không thể tải thông tin manga.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    try {
      setAddingToCart(true)
      await addToCart(Number(id), quantity)
      alert('Đã thêm vào giỏ hàng!')
    } catch (err) {
      alert('Không thể thêm vào giỏ hàng.')
    } finally {
      setAddingToCart(false)
    }
  }

  const handleWishlist = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    try {
      if (isWishlisted) {
        await api.delete(`/manga/${id}/wishlist`)
      } else {
        await api.post(`/manga/${id}/wishlist`)
      }
      setIsWishlisted(!isWishlisted)
    } catch (err) {
      console.error('Lỗi wishlist:', err)
    }
  }

  if (isLoading) return <LoadingSpinner />

  if (error || !manga) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy manga</h2>
        <Link
          to="/"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
        >
          Quay về trang chủ
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* ── Phần ảnh — gallery nhiều ảnh ── */}
        <div className="space-y-4">
          {/* Ảnh chính đang xem */}
          <img
            src={selectedImage || manga.coverImage}
            alt={manga.title}
            className="w-full rounded-lg shadow-lg object-cover"
            style={{ maxHeight: '500px' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://via.placeholder.com/400x500?text=No+Image'
            }}
          />

          {/* 📌 TODO: Gallery ảnh phụ — hiển thị nếu manga có nhiều ảnh
              Ảnh phụ lấy từ product_images trong DB (thêm ở Ngày 6)
              Hiện tại nếu chưa có data ảnh phụ thì section này ẩn */}
          {manga.images && manga.images.length > 0 && (
            <div className="flex gap-2 overflow-x-auto">
              {/* Ảnh bìa chính luôn hiển thị đầu tiên */}
              <img
                src={manga.coverImage}
                alt="Ảnh bìa"
                onClick={() => setSelectedImage(manga.coverImage)}
                className={`w-20 h-24 object-cover rounded cursor-pointer border-2
                  ${selectedImage === manga.coverImage
                    ? 'border-indigo-600'
                    : 'border-gray-200'}`}
              />
              {/* Các ảnh phụ */}
              {manga.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Ảnh ${idx + 1}`}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-24 object-cover rounded cursor-pointer border-2
                    ${selectedImage === img
                      ? 'border-indigo-600'
                      : 'border-gray-200'}`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/80x96?text=No+Image'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Phần thông tin — y chang zip ── */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{manga.title}</h1>

          <div className="space-y-2">
            <p className="text-lg text-gray-600">
              <span className="font-semibold">Tác giả:</span>{' '}
              <Link
                to={`/author/${manga.author?.id}`}
                className="text-indigo-600 hover:underline"
              >
                {manga.author?.name || 'Không rõ'}
              </Link>
            </p>
            <p className="text-lg text-gray-600">
              <span className="font-semibold">Thể loại:</span>{' '}
              {manga.categories?.map(cat => cat.name).join(', ')}
            </p>
            {/* Thông tin sách vật lý — thêm mới so với zip */}
            {manga.publisher && (
              <p className="text-lg text-gray-600">
                <span className="font-semibold">NXB:</span> {manga.publisher}
              </p>
            )}
            {manga.pages && (
              <p className="text-lg text-gray-600">
                <span className="font-semibold">Số trang:</span> {manga.pages}
              </p>
            )}
            <p className="text-lg text-gray-600">
              <span className="font-semibold">Tình trạng:</span>{' '}
              {manga.status === 'ongoing' ? 'Đang tiến hành' :
               manga.status === 'completed' ? 'Đã hoàn thành' : 'Tạm ngưng'}
            </p>
            <p className="text-lg text-gray-600">
              <span className="font-semibold">Năm phát hành:</span>{' '}
              {manga.releaseYear}
            </p>
            <div className="flex items-center">
              <span className="font-semibold text-lg text-gray-600 mr-2">
                Đánh giá:
              </span>
              <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
              <span className="ml-1 text-lg text-gray-700">
                {manga.rating?.toFixed(1) || '0.0'}
              </span>
            </div>
            {/* Tồn kho */}
            {manga.stock !== undefined && (
              <p className="text-lg text-gray-600">
                <span className="font-semibold">Còn hàng:</span>{' '}
                <span className={manga.stock > 0
                  ? 'text-green-600' : 'text-red-600'}>
                  {manga.stock > 0 ? `${manga.stock} cuốn` : 'Hết hàng'}
                </span>
              </p>
            )}
          </div>

          <div className="border-t border-b border-gray-200 py-4">
            <p className="text-2xl font-bold text-indigo-600">
              {manga.price?.toLocaleString('vi-VN')} ₫
            </p>
          </div>

          {/* Nút thêm giỏ hàng + wishlist */}
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center border-2 border-indigo-300 rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-12 h-12 flex items-center justify-center text-2xl font-bold
        text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 transition-colors"
              >
                -
              </button>
              <span className="w-14 h-12 flex items-center justify-center
      text-xl font-semibold border-x-2 border-indigo-300 bg-white">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-12 h-12 flex items-center justify-center text-2xl font-bold
        text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 transition-colors"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={addingToCart || (manga.stock !== undefined && manga.stock === 0)}
              className="flex-1 bg-indigo-600 text-white py-2 px-6 rounded-md
                hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addingToCart ? 'Đang thêm...' : '🛒 Thêm vào giỏ hàng'}
            </button>

            {/* Nút yêu thích */}
            <button
              onClick={handleWishlist}
              className="p-2 rounded-md border border-gray-300 hover:bg-gray-100"
              title={isWishlisted ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
            >
              <FontAwesomeIcon
                icon={isWishlisted ? faHeart : faHeartOutline}
                className={isWishlisted ? 'text-red-500' : 'text-gray-400'}
              />
            </button>
          </div>

          {/* Mô tả */}
          <div className="prose max-w-none">
            <h2 className="text-xl font-bold mb-2">Giới thiệu</h2>
            <p className="text-gray-600">{manga.description}</p>
          </div>

          {/* Reviews — y chang zip */}
          {manga.reviews && manga.reviews.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Đánh giá</h2>
              <div className="space-y-4">
                {manga.reviews.map(review => (
                  <div
                    key={review.id}
                    className="p-4 border border-gray-200 rounded-md"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{review.userName}</p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FontAwesomeIcon
                            key={i}
                            icon={faStar}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(review.date).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Manga liên quan — thêm mới */}
      {relatedManga.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Manga liên quan</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {relatedManga.map(m => (
              <MangaCard key={m.id} manga={m} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MangaDetail