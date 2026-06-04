// Manga.ts — interface cho dữ liệu manga/sách
// Map với ProductDto trả về từ Backend API

export interface Author {
  id: number;
  name: string;
  image: string;      // = avatarUrl trong Author entity
  biography: string;  // = bio trong Author entity
  mangaCount: number;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  count: number;
}

export interface Review {
  id: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Chapter {
  id: number;
  number: number;
  title: string;
  releaseDate: string;
  pageCount: number;
}

// Interface Manga — map với ProductDto backend
export interface Manga {
  id: number;
  title: string;
  alternativeTitles: string[];
  description: string;
  coverImage: string;       // = imageUrl trong Product entity
  author: Author;
  categories: Category[];
  status: 'ongoing' | 'completed' | 'hiatus';
  releaseYear: number;
  rating: number;           // = averageRating trong Product entity
  price: number;
  publisher: string;
  pages: number;
  language: string;
  reviews: Review[];
  chapters: Chapter[];
  relatedManga: number[];   // Array manga IDs liên quan
  isNew: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  // Thêm mới — gallery ảnh và tồn kho
  images?: string[];        // Danh sách link ảnh gallery
  stock?: number;           // Số lượng tồn kho
  soldCount?: number;       // Số đã bán
}