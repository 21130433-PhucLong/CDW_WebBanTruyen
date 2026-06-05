import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import LoadingSpinner from '../components/common/LoadingSpinner'
import MangaCard from '../components/common/MangaCard'
import type { Manga } from '../models/types'
import type { Author } from '../models/Manga'
import api from '../services/api'

const AuthorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [author, setAuthor] = useState<Author | null>(null)
  const [mangas, setMangas] = useState<Manga[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const fetchData = async () => {
      try {
        setIsLoading(true)
        // Gọi song song thông tin tác giả và manga của tác giả
        const [authorRes, mangasRes] = await Promise.all([
          api.get<Author>(`/authors/${id}`),
          api.get<Manga[]>(`/authors/${id}/manga`),
        ])
        setAuthor(authorRes.data)
        setMangas(mangasRes.data)
      } catch (err) {
        setError('Không thể tải thông tin tác giả.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (isLoading) return <LoadingSpinner />

  if (error || !author) {
    return (
      <div className="container mx-auto py-10">
        <h2 className="text-2xl font-bold text-gray-800">
          Tác giả không tồn tại.
        </h2>
        <Link to="/" className="text-indigo-600 hover:underline mt-4 block">
          Quay về trang chủ
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row items-start md:items-center">
        <img
          src={author.image || 'https://via.placeholder.com/150'}
          alt={author.name}
          className="w-32 h-32 rounded-full object-cover mr-6"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://via.placeholder.com/150?text=Author'
          }}
        />
        <div className="mt-4 md:mt-0">
          <h1 className="text-3xl font-bold text-gray-800">{author.name}</h1>
          <p className="text-gray-600 mt-2">{author.biography}</p>
          <p className="mt-1 text-gray-500">{author.mangaCount} tác phẩm</p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Các tác phẩm</h2>
        {mangas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mangas.map(manga => (
              <MangaCard key={manga.id} manga={manga} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            Chưa có tác phẩm nào của tác giả này.
          </p>
        )}
      </div>
    </div>
  )
}

export default AuthorDetail