import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MangaCard from '../components/common/MangaCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook } from '@fortawesome/free-solid-svg-icons'
import { mangaService } from '../services/mangaService'
import type { Manga, Category, Author } from '../models/types'

const Home: React.FC = () => {
  // State cho từng section — không dùng mockData
  const [featuredManga, setFeaturedManga] = useState<Manga[]>([])
  const [newReleases, setNewReleases] = useState<Manga[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [popularAuthors, setPopularAuthors] = useState<Author[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Gọi API khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        // Gọi 4 API song song — nhanh hơn gọi tuần tự
        const [featuredRes, newRes, categoriesRes, authorsRes] =
          await Promise.all([
            mangaService.getFeatured(),
            mangaService.getNewReleases(),
            // Gọi trực tiếp api vì mangaService chưa có getCategories
            import('../services/api').then(m =>
              m.default.get<Category[]>('/categories')),
            // Gọi trực tiếp api vì mangaService chưa có getPopularAuthors
            import('../services/api').then(m =>
              m.default.get<Author[]>('/authors/popular')),
          ])
        setFeaturedManga(featuredRes.data)
        setNewReleases(newRes.data)
        setCategories(categoriesRes.data)
        setPopularAuthors(authorsRes.data)
      } catch (err) {
        console.error('Lỗi khi tải trang chủ:', err)
        setError('Không thể tải dữ liệu. Vui lòng thử lại.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Hiện spinner khi đang loading
  if (isLoading) return <LoadingSpinner />

  // Hiện lỗi nếu có
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12">

      {/* ── Hero Section ── */}
      {/* 📌 TODO: Thay /images/background.jpg bằng ảnh banner thật
          Cách làm: tạo thư mục public/images/ trong comicop-frontend/
          Tải ảnh về đặt vào đó tên background.jpg
          Hoặc dùng link ảnh từ Internet */}
      <section
        className="relative h-96 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(99,102,241,0.6), rgba(139,92,246,0.6)), url('/images/background.jpg')",
        }}
      >
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">
              Khám phá thế giới Manga
            </h1>
            <p className="text-lg mb-8">
              Thư viện truyện đa dạng với hàng nghìn tựa truyện
              từ nhiều thể loại khác nhau.
            </p>
            <Link
              to="/manga"
              className="bg-white text-indigo-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100"
            >
              Khám phá ngay
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured Manga ── */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Manga nổi bật</h2>
        {featuredManga.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {featuredManga.map((manga) => (
              <MangaCard key={manga.id} manga={manga} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Chưa có manga nổi bật.</p>
        )}
      </section>

      {/* ── New Releases ── */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Mới phát hành</h2>
        {newReleases.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {newReleases.map((manga) => (
              <MangaCard key={manga.id} manga={manga} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Chưa có manga mới.</p>
        )}
      </section>

      {/* ── Categories ── */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Thể loại truyện</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/manga?categoryId=${category.id}`}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <FontAwesomeIcon
                icon={faBook}
                size="2x"
                className="text-indigo-600 mb-2"
              />
              <h3 className="font-medium text-gray-900">{category.name}</h3>
              <p className="text-sm text-gray-600">{category.count} truyện</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Popular Authors ── */}
      <section className="container mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold mb-6">Tác giả nổi tiếng</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {popularAuthors.map((author) => (
            <div
              key={author.id}
              className="bg-white p-4 rounded-lg shadow-md text-center"
            >
              <Link to={`/author/${author.id}`}>
                <img
                  src={author.image}
                  alt={author.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      '/images/authors/author.jpg'
                  }}
                />
              </Link>
              <Link
                to={`/author/${author.id}`}
                className="font-medium text-gray-900 hover:underline block mb-2"
              >
                {author.name}
              </Link>
              <p className="text-sm text-gray-600">
                {author.mangaCount} tác phẩm
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}

export default Home