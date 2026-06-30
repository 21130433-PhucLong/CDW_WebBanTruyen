import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Manga, Category } from '../models/types'
import MangaCard from '../components/common/MangaCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import api from '../services/api'

const PRICE_PRESETS = [
  { label: 'Dưới 30.000đ',        min: 0,      max: 30000 },
  { label: '30.000đ – 60.000đ',   min: 30000,  max: 60000 },
  { label: '60.000đ – 100.000đ',  min: 60000,  max: 100000 },
  { label: 'Trên 100.000đ',       min: 100000, max: 9999999 },
]

const formatVND = (value: number) =>
  value.toLocaleString('vi-VN')

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [results, setResults] = useState<Manga[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null)
  const [customMin, setCustomMin] = useState('')
  const [customMax, setCustomMax] = useState('')

  const query = searchParams.get('q') || ''
  const sortBy = searchParams.get('sort') || 'title'

  // Lấy danh sách thể loại 1 lần khi mount
  useEffect(() => {
    api.get<Category[]>('/categories').then(res => {
      setCategories(res.data)
    })
  }, [])

  // Gọi API tìm kiếm khi query/sort thay đổi
  useEffect(() => {
    if (!query) return
    const fetchResults = async () => {
      try {
        setIsLoading(true)
        const res = await api.get(
          `/manga/search?q=${encodeURIComponent(query)}&page=0&size=50`
        )
        setResults(res.data.content || res.data || [])
      } catch {
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchResults()
  }, [query])

  // Tính khoảng giá hiện tại
  const getPriceRange = () => {
    if (selectedPreset !== null) return PRICE_PRESETS[selectedPreset]
    const min = customMin ? parseInt(customMin.replace(/\D/g, '')) : 0
    const max = customMax ? parseInt(customMax.replace(/\D/g, '')) : 9999999
    return { min, max }
  }

  // Filter + sort client-side
  const filtered = results
    .filter(m => {
      // Filter category
      if (selectedCategories.length > 0) {
        const hasCategory = m.categories?.some(cat =>
          selectedCategories.includes(cat.id))
        if (!hasCategory) return false
      }
      // Filter giá
      const { min, max } = getPriceRange()
      if (m.price < min || m.price > max) return false
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':  return a.price - b.price
        case 'price-desc': return b.price - a.price
        case 'rating':     return (b.rating || 0) - (a.rating || 0)
        case 'newest':     return (b.releaseYear || 0) - (a.releaseYear || 0)
        case 'best-seller':return (b.soldCount || 0) - (a.soldCount || 0)
        default:           return a.title.localeCompare(b.title)
      }
    })

  const handleCategoryChange = (id: number) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  const handleSortChange = (value: string) => {
    setSearchParams(prev => { prev.set('sort', value); return prev })
  }

  const handlePresetClick = (idx: number) => {
    // Click lại preset đang chọn → bỏ chọn
    setSelectedPreset(prev => prev === idx ? null : idx)
    setCustomMin('')
    setCustomMax('')
  }

  const handleResetFilter = () => {
    setSelectedCategories([])
    setSelectedPreset(null)
    setCustomMin('')
    setCustomMax('')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* ── SIDEBAR FILTER ── */}
        <aside className="md:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200
            shadow-sm p-5 space-y-6 sticky top-24">

            {/* Tiêu đề sidebar */}
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-800 uppercase
                tracking-wide">
                Bộ lọc
              </h3>
              <button
                onClick={handleResetFilter}
                className="text-xs text-indigo-600 hover:text-indigo-800
                  font-medium underline"
              >
                Xoá tất cả
              </button>
            </div>

            {/* ── Thể loại ── */}
            <div>
              <h4 className="text-sm font-bold text-gray-700 uppercase
                tracking-wide mb-3 pb-2 border-b border-gray-100">
                Thể loại
              </h4>
              <div className="space-y-1">
                {categories.map(cat => (
                  <label
                    key={cat.id}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg
                      cursor-pointer transition-colors
                      ${selectedCategories.includes(cat.id)
                        ? 'bg-indigo-50 text-blue-600'
                        : 'hover:bg-gray-50 text-gray-700'
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.id)}
                      onChange={() => handleCategoryChange(cat.id)}
                      className="w-4 h-4 rounded border-gray-300
                        text-indigo-600 focus:ring-indigo-500 flex-shrink-0"
                    />
                    <span className="text-sm flex-1 px-2">{cat.name}</span>
                    <span className="text-sm text-gray-500 px-0.5"> (
                      {cat.count || ''})
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* ── Khoảng giá ── */}
            <div>
              <h4 className="text-sm font-bold text-gray-700 uppercase
                tracking-wide mb-3 pb-2 border-b border-gray-100">
                Khoảng giá
              </h4>

              {/* Preset giá */}
              <div className="space-y-1 mb-4">
                {PRICE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePresetClick(idx)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm
                      transition-colors
                      ${selectedPreset === idx
                        ? 'bg-indigo-600 text-white font-medium'
                        : 'hover:bg-gray-50 text-gray-700'
                      }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Nhập giá tuỳ chỉnh */}
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-700 mb-2 font-medium">
                  Hoặc nhập khoảng giá:
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Từ"
                      value={customMin
                        ? Number(customMin).toLocaleString('vi-VN')
                        : ''}
                      onChange={e => {
                        setSelectedPreset(null)
                        // Chỉ lấy số
                        setCustomMin(e.target.value.replace(/\D/g, ''))
                      }}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300
                        rounded-lg focus:outline-none focus:border-indigo-400
                        text-right"
                    />
                    <p className="text-xs text-gray-400 text-right mt-0.5">đ</p>
                  </div>
                  <span className="text-gray-400 text-sm flex-shrink-0">–</span>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Đến"
                      value={customMax
                        ? Number(customMax).toLocaleString('vi-VN')
                        : ''}
                      onChange={e => {
                        setSelectedPreset(null)
                        setCustomMax(e.target.value.replace(/\D/g, ''))
                      }}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300
                        rounded-lg focus:outline-none focus:border-indigo-400
                        text-right"
                    />
                    <p className="text-xs text-gray-400 text-right mt-0.5">đ</p>
                  </div>
                </div>

                {/* Hiển thị khoảng giá đang chọn */}
                {(customMin || customMax) && (
                  <p className="text-xs text-indigo-600 mt-2 font-medium">
                    {formatVND(parseInt(customMin || '0'))}đ
                    {' '}–{' '}
                    {customMax
                      ? formatVND(parseInt(customMax)) + 'đ'
                      : 'trở lên'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* ── KẾT QUẢ ── */}
        <div className="md:col-span-3">

          {/* Header kết quả */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            {/* Chữ kết quả — đẹp hơn, nổi bật hơn */}
            <div>
              {query ? (
                <p className="text-gray-700">
                  <span className="font-bold text-gray-900 uppercase
                    tracking-wide text-sm">
                    Kết quả tìm kiếm:{' '}
                  </span>
                  <span className="text-red-600 font-semibold">
                    {query}
                  </span>
                  <span className="text-gray-600 text-sm ml-2">
                    ({filtered.length} kết quả)
                  </span>
                </p>
              ) : (
                <p className="text-gray-500">Nhập từ khoá để tìm kiếm</p>
              )}
            </div>

            {/* Dropdown sắp xếp */}
            <select
              value={sortBy}
              onChange={e => handleSortChange(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg
                focus:outline-none focus:border-indigo-500 bg-white
                cursor-pointer"
            >
              <option value="title">Sắp xếp theo tên</option>
              <option value="price-asc">Giá thấp đến cao</option>
              <option value="price-desc">Giá cao đến thấp</option>
              <option value="rating">Đánh giá cao nhất</option>
              <option value="newest">Hàng mới nhất</option>
              <option value="best-seller">Bán chạy nhất</option>
            </select>
          </div>

          {/* Tags filter đang chọn */}
          {(selectedCategories.length > 0 || selectedPreset !== null
            || customMin || customMax) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCategories.map(id => {
                const cat = categories.find(c => c.id === id)
                return cat ? (
                  <span key={id}
                    className="inline-flex items-center gap-1 px-3 py-1
                      bg-indigo-100 text-indigo-700 rounded-full text-sm">
                    {cat.name}
                    <button
                      onClick={() => handleCategoryChange(id)}
                      className="ml-1 hover:text-indigo-900 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ) : null
              })}
              {selectedPreset !== null && (
                <span className="inline-flex items-center gap-1 px-3 py-1
                  bg-indigo-100 text-indigo-700 rounded-full text-sm">
                  {PRICE_PRESETS[selectedPreset].label}
                  <button
                    onClick={() => setSelectedPreset(null)}
                    className="ml-1 hover:text-indigo-900 font-bold"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Grid sản phẩm */}
          {isLoading ? (
            <LoadingSpinner />
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(manga => (
                <MangaCard key={manga.id} manga={manga} />
              ))}
            </div>
          ) : query ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-gray-600 text-lg font-medium mb-2">
                Không tìm thấy kết quả cho "{query}"
              </p>
              <p className="text-gray-400 text-sm">
                Thử tìm với từ khoá khác hoặc bỏ bớt bộ lọc
              </p>
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-gray-500">Nhập tên manga để tìm kiếm</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Search