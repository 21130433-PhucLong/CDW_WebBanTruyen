import axios from 'axios';

// Tạo axios instance với config mặc định
// Tất cả request đều dùng instance này — không tạo axios mới ở mỗi file
const api = axios.create({
  // Đọc URL từ .env — nếu không có thì dùng localhost:8080
  // Vite dùng import.meta.env thay vì process.env
  baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Manga API — gọi các endpoint liên quan đến manga
export const mangaApi = {
  getFeatured: () => api.get('/manga/featured'),
  getNewReleases: () => api.get('/manga/new'),
  getMangaById: (id: string) => api.get(`/manga/${id}`),
  getRelatedManga: (id: string) => api.get(`/manga/${id}/related`),
  searchManga: (query: string) => api.get(`/manga/search?q=${query}`),
};

// Category API
export const categoryApi = {
  getAll: () => api.get('/categories'),
  getMangaByCategory: (categoryId: string) =>
    api.get(`/categories/${categoryId}/manga`),
};

// Author API
export const authorApi = {
  getPopular: () => api.get('/authors/popular'),
  getAuthorById: (id: string) => api.get(`/authors/${id}`),
  getAuthorManga: (id: string) => api.get(`/authors/${id}/manga`),
};

// Cart API — cần JWT token (tự gắn qua interceptor bên dưới)
export const cartApi = {
  getItems: () => api.get('/cart'),
  addItem: (mangaId: number, quantity: number) =>
    api.post('/cart', { mangaId, quantity }),
  updateItem: (itemId: number, quantity: number) =>
    api.put(`/cart/${itemId}`, { quantity }),
  removeItem: (itemId: number) => api.delete(`/cart/${itemId}`),
  clearCart: () => api.delete('/cart'),
};

// Request interceptor — tự gắn JWT token vào header mỗi request
// Không cần thêm token thủ công ở mỗi API call
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — xử lý lỗi tập trung
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Token hết hạn hoặc không hợp lệ → xoá token, về trang login
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 404:
          console.error('Không tìm thấy resource');
          break;
        default:
          console.error('Lỗi API:', error.response.data);
      }
    } else if (error.request) {
      console.error('Lỗi mạng:', error.request);
    } else {
      console.error('Lỗi:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;