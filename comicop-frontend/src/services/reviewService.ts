import api from './api'

export interface ReviewDto {
  reviewId: number
  userName: string
  rating: number
  comment: string
  createdAt: string
}

export const reviewService = {
  getReviews: (productId: number) =>
    api.get<ReviewDto[]>(`/manga/${productId}/reviews`),

  createReview: (productId: number, rating: number, comment: string) =>
    api.post<ReviewDto>(`/manga/${productId}/reviews`, { rating, comment }),
}