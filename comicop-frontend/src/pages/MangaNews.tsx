import React, { useEffect, useState } from 'react'
import axios from 'axios'
import LoadingSpinner from '../components/common/LoadingSpinner'

interface Article {
  title: string
  description: string
  url: string
  image: string
  publishedAt: string
  source: {
    name: string
  }
}

const MangaNews: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // GNews API — dùng token từ .env
        const response = await axios.get('https://gnews.io/api/v4/search', {
          params: {
            q: 'Manga OR Anime Japan',
            lang: 'vi',
            max: 20,
            token: import.meta.env.VITE_APP_GNEWS_API_TOKEN,
          },
        })
        setArticles(response.data.articles)
      } catch (err: any) {
        setError(err.message || 'Đã xảy ra lỗi khi tải tin tức.')
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [])

  if (loading) return <LoadingSpinner />

  if (error) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <p className="text-red-500">Lỗi: {error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">
        Tin tức manga &amp; anime mới nhất
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {article.image && (
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-48 object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            )}
            <div className="p-4">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl font-semibold text-indigo-600 hover:underline transition-colors"
              >
                {article.title}
              </a>
              <p className="text-gray-600 mt-2">
                {article.description?.substring(0, 100)}...
              </p>
              <div className="mt-3 text-sm text-gray-500">
                <span>
                  {new Date(article.publishedAt).toLocaleDateString('vi-VN')}
                </span>
                <span className="mx-1">|</span>
                <span>{article.source.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MangaNews