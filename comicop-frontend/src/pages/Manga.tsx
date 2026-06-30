import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import MangaCard from '../components/common/MangaCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import type { Manga, Category } from '../models/types'
import api from '../services/api'

const MangaPage: React.FC = () => {
  // Đọc query params từ URL: /manga?categoryId=1
  const [searchParams, setSearchParams] = useSearchParams()

  const [mangas, setMangas] = useState<Manga[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Phân trang
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Lấy categoryId từ URL nếu có
  const categoryId = searchParams.get('categoryId')
  const [selectedCategory, setSelectedCategory] =
    useState<number | 'all'>(
      categoryId ? parseInt(categoryId) : 'all'
    )

  // Fetch danh sách thể loại 1 lần khi mount
  useEffect(() => {
    api.get<Category[]>('/categories').then(res => {
      setCategories(res.data)
    }).catch(err => console.error('Lỗi lấy categories:', err))
  }, [])

  // Fetch manga khi category hoặc page thay đổi
  useEffect(() => {
    const fetchMangas = async () => {
      try {
        setIsLoading(true)
        let res
        if (selectedCategory === 'all') {
          // Lấy tất cả manga có phân trang
          res = await api.get(
            `/manga?page=${currentPage}&size=12&sortBy=newest`
          )
        } else {
          // Lấy theo thể loại
          res = await api.get(
            `/categories/${selectedCategory}/manga?page=${currentPage}&size=12`
          )
        }
        setMangas(res.data.content || res.data)
        setTotalPages(res.data.totalPages || 1)
      } catch (err) {
        console.error('Lỗi lấy danh sách manga:', err)
        setError('Không thể tải danh sách manga.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchMangas()
  }, [selectedCategory, currentPage])

  // Khi chọn category mới → reset về trang đầu
  const handleCategoryChange = (catId: number | 'all') => {
    setSelectedCategory(catId)
    setCurrentPage(0)
    if (catId === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ categoryId: String(catId) })
    }
  }

  return (
    <div className="space-y-16">

      <section
        className="relative h-96 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(99,102,241,0.7), rgba(139,92,246,0.7)), url('/images/hero.jpg')",
        }}
      >
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-xl">
            <h1 className="text-5xl font-extrabold mb-4">
              Bộ sưu tập Manga
            </h1>
            <p className="text-xl mb-6">
              Khám phá kho truyện đa dạng từ hành động,
              phiêu lưu, drama và nhiều thể loại khác.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Lọc theo thể loại</h2>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {/* Nút Tất cả */}
          <button
            onClick={() => handleCategoryChange('all')}
            className={`flex-shrink-0 bg-white w-40 p-4 rounded-lg shadow-md
              transition-transform transform text-center
              ${selectedCategory === 'all'
                ? 'border-2 border-indigo-600'
                : ''}`}
          >
            <FontAwesomeIcon
              icon={faFilter}
              size="2x"
              className="text-indigo-600 mb-2"
            />
            <h3 className="font-semibold text-lg text-gray-900">Tất cả</h3>
          </button>

          {/* Các thể loại từ API */}
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`flex-shrink-0 bg-white w-40 p-4 rounded-lg shadow-md
                hover:shadow-xl transition-transform transform hover:scale-105
                text-center
                ${selectedCategory === category.id
                  ? 'border-2 border-indigo-600'
                  : ''}`}
            >
              <FontAwesomeIcon
                icon={faFilter}
                size="2x"
                className="text-indigo-600 mb-2"
              />
              <h3 className="font-semibold text-lg text-gray-900">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600">{category.count} truyện</p>
            </button>
          ))}
        </div>
      </section>

      {/* ── Manga List ── */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Danh sách Manga</h2>

        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : mangas.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {mangas.map((manga) => (
                <MangaCard key={manga.id} manga={manga} />
              ))}
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10 mb-3">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 0))}
                  disabled={currentPage === 0}
                  className="px-4 py-2 rounded-lg border border-gray-300
                    disabled:opacity-40 hover:bg-gray-100"
                >
                  ← Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`px-4 py-2 rounded-lg border
                      ${currentPage === i
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-gray-300 hover:bg-gray-100'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage(p => Math.min(p + 1, totalPages - 1))}
                  disabled={currentPage === totalPages - 1}
                  className="px-4 py-2 rounded-lg border border-gray-300
                    disabled:opacity-40 hover:bg-gray-100"
                >
                  Sau →
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-600">
            Không có manga nào với thể loại được chọn.
          </p>
        )}
      </section>

    </div>
  )
}

export default MangaPage