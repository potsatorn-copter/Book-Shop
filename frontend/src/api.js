import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: BASE_URL,
});

// 1. Get All (ดูทั้งหมด) 
export const getBooks = () => {
  return api.get('/books');
};

// 2. Get One (ดูเล่มเดียว) 
export const getBook = (id) => {
  return api.get(`/books/${id}`);
};

// 3. Create (สร้าง) 
export const createBook = (book) => {
  return api.post('/books', book);
};

// 4. Update (แก้ไข)
export const updateBook = (id, book) => {
  return api.put(`/books/${id}`, book);
};

// 5. Delete (ลบ)
export const deleteBook = (id) => {
  return api.delete(`/books/${id}`);
};

export default api;