import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Manga, Category } from '../models/types'
import MangaCard from '../components/common/MangaCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import api from '../services/api'

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [results, setResults] = useState<Manga[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 })

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
          `/manga/search?q=${encodeURIComponent(query)}&page=0&size=20`
        )
        let data: Manga[] = res.data.content || res.data

        // Filter theo thể loại nếu có chọn
        if (selectedCategories.length > 0) {
          data = data.filter(m =>
            m.categories?.some(cat => selectedCategories.includes(cat.id))
          )
        }

        // Filter theo giá
        data = data.filter(m =>
          m.price >= priceRange.min && m.price <= priceRange.max
        )

        data.sort((a, b) => {
          switch (sortBy) {
            case 'price-asc':  return a.price - b.price
            case 'price-desc': return b.price - a.price
            case 'rating':     return (b.rating || 0) - (a.rating || 0)
            default:           return a.title.localeCompare(b.title)
          }
        })
        setResults(data)
      } catch (err) {
        console.error('Lỗi tìm kiếm:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchResults()
  }, [query, sortBy, selectedCategories, priceRange])

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleSortChange = (value: string) => {
    setSearchParams(prev => {
      prev.set('sort', value)
      return prev
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Thể loại</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <label key={category.id} className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                  />
                  <span className="ml-2 text-gray-700">{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Giá</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700">Từ</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                    focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={priceRange.min}
                  onChange={e => setPriceRange(prev =>
                    ({ ...prev, min: Number(e.target.value) }))}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">Đến</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                    focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={priceRange.max}
                  onChange={e => setPriceRange(prev =>
                    ({ ...prev, max: Number(e.target.value) }))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="md:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-700">
              {query
                ? `Tìm thấy ${results.length} kết quả cho "${query}"`
                : 'Nhập từ khoá để tìm kiếm'}
            </p>
            <select
              className="rounded-md border-gray-300 shadow-sm
                focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={sortBy}
              onChange={e => handleSortChange(e.target.value)}
            >
              <option value="title">Sắp xếp theo tên</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="rating">Đánh giá cao nhất</option>
            </select>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map(manga => (
                  <MangaCard key={manga.id} manga={manga} />
                ))}
              </div>
              {results.length === 0 && query && (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    Không tìm thấy kết quả phù hợp
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Search