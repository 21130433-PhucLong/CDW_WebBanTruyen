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
import { toast } from 'react-toastify'

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

  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  // const [lightboxImage, setLightboxImage] = useState('')

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
        setSelectedIndex(0)
        setRelatedManga(relatedRes.data)
      } catch (err) {
        setError('Không thể tải thông tin manga.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id])

  const goToPrevImage = () => {
    setSlideDirection('right') // Lùi về trước → trượt từ trái sang phải
    // const allImages = [manga!.coverImage, ...(manga!.images || [])]
    setSelectedIndex(prev => Math.max(0, prev - 1))
  }

  const goToNextImage = () => {
    setSlideDirection('left') // Tiến tới sau → trượt từ phải sang trái
    // const allImages = [manga!.coverImage, ...(manga!.images || [])]
    const totalImages = 1 + (manga?.images?.length || 0)
    setSelectedIndex(prev => Math.min(totalImages - 1, prev + 1))
  }

  // Khi click thumbnail trực tiếp — tự xác định hướng dựa vào vị trí cũ/mới
  const goToImage = (newIndex: number) => {
    setSlideDirection(newIndex > selectedIndex ? 'left' : 'right')
    setSelectedIndex(newIndex)
  }

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    try {
      setAddingToCart(true)
      await addToCart(Number(id), quantity)
      toast.success('Đã thêm vào giỏ hàng!')
    } catch (err) {
      toast.error('Không thể thêm vào giỏ hàng.')
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

          {/* Tạo mảng tất cả ảnh: bìa chính + ảnh phụ */}
          {(() => {
            const allImages = [manga.coverImage, ...(manga.images || [])]
            const isFirstImage = selectedIndex === 0
            const isLastImage = selectedIndex === allImages.length - 1
            
            return (
              <>
                {/* Ảnh chính — click để mở lightbox xem to */}
                <img
                  key={selectedIndex}
                  src={allImages[selectedIndex] || manga.coverImage}
                  alt={manga.title}
                  className="w-full rounded-lg shadow-lg object-contain cursor-zoom-in"
                  style={{ maxHeight: '500px' }}
                  onClick={() => {
                    // setLightboxImage(allImages[selectedIndex] || manga.coverImage)
                    setLightboxOpen(true)
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/400x500?text=No+Image'
                  }}
                />

                {/* Nút ‹ — ẩn nếu đang ở ảnh đầu tiên */}
                {allImages.length > 1 && !isFirstImage && (
                  <button
                    onClick={(e) => { e.stopPropagation(); goToPrevImage() }}
                    className="absolute left-2 top-1/2 -translate-y-1/2
                      w-9 h-9 bg-white bg-opacity-80 hover:bg-opacity-100
                      rounded-full flex items-center justify-center
                      shadow-md text-gray-700 font-bold text-lg transition-all
                      opacity-0 group-hover:opacity-100"
                  >
                    ‹
                  </button>
                )}

                {/* Nút › — ẩn nếu đang ở ảnh cuối cùng */}
                {allImages.length > 1 && !isLastImage && (
                  <button
                    onClick={(e) => { e.stopPropagation(); goToNextImage() }}
                    className="absolute right-2 top-1/2 -translate-y-1/2
                      w-9 h-9 bg-white bg-opacity-80 hover:bg-opacity-100
                      rounded-full flex items-center justify-center
                      shadow-md text-gray-700 font-bold text-lg transition-all
                      opacity-0 group-hover:opacity-100"
                  >
                    ›
                  </button>
                )}

                {/* Số thứ tự ảnh — tiện theo dõi đang xem ảnh mấy/tổng mấy */}
                {allImages.length > 1 && (
                  <span className="absolute bottom-2 right-2 bg-black bg-opacity-50
                    text-white text-xs px-2 py-1 rounded-full">
                    {selectedIndex + 1} / {allImages.length}
                  </span>
                )}

                {/* Thumbnail gallery — chỉ hiện nếu có từ 2 ảnh trở lên */}
                {allImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {allImages.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Ảnh ${idx + 1}`}
                        onClick={() => goToImage(idx)}
                        className={`w-20 h-24 object-cover rounded cursor-pointer
                          border-2 flex-shrink-0 transition-all
                          ${selectedIndex === idx
                            ? 'border-indigo-600 ring-2 ring-indigo-300'
                            : 'border-gray-200 hover:border-gray-400'
                          }`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://via.placeholder.com/80x96?text=No+Image'
                        }}
                      />
                    ))}
                  </div>
                )}
              </>
            )
          })()}
        </div>

        {/* ── Phần thông tin ── */}
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
            <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-lg text-gray-600">Thể loại:</span>
            {manga.categories?.map(cat => (
              <span
                key={cat.id}
                onClick={() => navigate(`/manga?categoryId=${cat.id}`)}
                className="px-3 py-1 bg-indigo-100 text-blue-600 rounded-full
                  text-sm font-medium cursor-pointer hover:bg-indigo-200 transition-colors"
              >
                {cat.name}
              </span>
            ))}
          </div>
            {/* Thông tin sách  */}
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
            {/* Số đã bán */}
            {manga.soldCount !== undefined && manga.soldCount > 0 && (
              <p className="text-lg text-gray-600">
                <span className="font-semibold">Đã bán:</span>{' '}
                <span className="text-orange-700 font-medium">
                  {manga.soldCount.toLocaleString('vi-VN')}
                </span> cuốn
              </p>
            )}
            {/* thông báo sắp hết hàng */}
            {manga.stock !== undefined && manga.stock > 0 && manga.stock <= 10 && (
              <p className="text-red-500 text-sm font-medium animate-pulse">
                ⚠️ Chỉ còn {manga.stock} cuốn — Mua ngay kẻo hết!
              </p>
            )}
          </div>

          <div className="border-t border-b border-gray-200 py-4">
            <p className="text-2xl font-bold text-indigo-900">
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
                −
              </button>

              {/* Input nhập tay — không bao giờ về 0 */}
              <input
                type="number"
                min={1}
                max={manga.stock || 99}
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value)
                  if (isNaN(val) || val < 1) {
                    setQuantity(1)
                  } else if (manga.stock && val > manga.stock) {
                    setQuantity(manga.stock)
                  } else {
                    setQuantity(val)
                  }
                }}
                onBlur={(e) => {
                  if (!parseInt(e.target.value) || parseInt(e.target.value) < 1) {
                    setQuantity(1)
                  }
                }}
                className="w-16 h-12 text-center text-xl font-semibold border-x-2
                  border-indigo-300 bg-white focus:outline-none focus:bg-indigo-50
                  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                  [&::-webkit-inner-spin-button]:appearance-none"
              />

              <button
                onClick={() => setQuantity(q =>
                  manga.stock ? Math.min(q + 1, manga.stock) : q + 1)}
                className="w-12 h-12 flex items-center justify-center text-2xl font-bold
                  text-blue-600 hover:bg-indigo-50 active:bg-indigo-100 transition-colors"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={addingToCart || (manga.stock !== undefined && manga.stock === 0)}
              className="flex-1 bg-blue-600 text-white py-2 px-6 rounded-md
                hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Chính sách đổi trả — tăng độ tin cậy cho sản phẩm */}
          <div className="bg-gray-100 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <span>🔄</span>
              <span>Đổi trả miễn phí trong <strong>7 ngày</strong> nếu sản phẩm lỗi</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span>🚚</span>
              <span>Miễn phí ship đơn từ <strong>150.000đ</strong></span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span>✅</span>
              <span>Cam kết sách mới 100%, đóng gói cẩn thận</span>
            </div>
          </div>

          {/* Mô tả */}
          <div className="prose max-w-none">
            <h2 className="text-xl font-bold mb-2">Giới thiệu</h2>
            <p className="text-gray-600">{manga.description}</p>
          </div>

          {/* Reviews */}
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

      {/* Lightbox — xem ảnh to ở giữa màn hình, click ngoài để đóng */}
        {lightboxOpen && (() => {
          const allImages = [manga.coverImage, ...(manga.images || [])]
          const isFirstImage = selectedIndex === 0
          const isLastImage = selectedIndex === allImages.length - 1

          return (
            <div
              className="fixed inset-0 bg-black bg-opacity-80 z-50
                flex items-center justify-center p-4"
              onClick={() => setLightboxOpen(false)}
            >
              <div className="relative max-w-3xl max-h-full">
                <img
                  key={selectedIndex}
                  src={allImages[selectedIndex]}
                  alt="Xem ảnh lớn"
                  className={`max-w-full max-h-screen object-contain rounded-lg shadow-2xl
                    ${slideDirection === 'left' ? 'animate-slide-left' : 'animate-slide-right'}`}
                  onClick={e => e.stopPropagation()}
                />

                {/* Nút ‹ trong lightbox */}
                {allImages.length > 1 && !isFirstImage && (
                  <button
                    onClick={(e) => { e.stopPropagation(); goToPrevImage() }}
                    className="absolute left-2 top-1/2 -translate-y-1/2
                      w-10 h-10 bg-white bg-opacity-90 hover:bg-opacity-100
                      rounded-full flex items-center justify-center
                      shadow-lg text-gray-800 font-bold text-xl"
                  >
                    ‹
                  </button>
                )}

                {/* Nút › trong lightbox */}
                {allImages.length > 1 && !isLastImage && (
                  <button
                    onClick={(e) => { e.stopPropagation(); goToNextImage() }}
                    className="absolute right-2 top-1/2 -translate-y-1/2
                      w-10 h-10 bg-white bg-opacity-90 hover:bg-opacity-100
                      rounded-full flex items-center justify-center
                      shadow-lg text-gray-800 font-bold text-xl"
                  >
                    ›
                  </button>
                )}

                {/* Nút đóng */}
                <button
                  onClick={() => setLightboxOpen(false)}
                  className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full
                    flex items-center justify-center text-gray-800 font-bold text-lg
                    shadow-lg hover:bg-gray-100"
                >
                  ✕
                </button>

                <p className="text-white text-center text-sm mt-2 opacity-70">
                  {selectedIndex + 1} / {allImages.length} — Click ra ngoài hoặc ✕ để đóng
                </p>
              </div>
            </div>
          )
        })()}

      {/* Manga liên quan — thêm mới */}
      {relatedManga.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Manga liên quan</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 p-1">
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