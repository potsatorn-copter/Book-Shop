import axios from 'axios';

// 1. กำหนด URL ของ Backend 
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: BASE_URL,
});

// 2. ✨ เพิ่ม Interceptor (ด่านตรวจก่อนส่งของ)
// ทุกครั้งที่จะยิง API โค้ดตรงนี้จะทำงานก่อนเสมอ
api.interceptors.request.use((config) => {
  // ไปค้นใน LocalStorage ว่ามีบัตรผ่านไหม
  const token = localStorage.getItem('token');
  
  // ถ้ามี -> แนบไปใน Header ชื่อ Authorization
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- รวมมิตรฟังก์ชัน API ---

export const register = (data) => api.post('/register', data);
export const login = (data) => api.post('/login', data);

export const getBooks = () => api.get('/api/books');
export const createBook = (data) => api.post('/api/books', data);
export const updateBook = (id, data) => api.put(`/api/books/${id}`, data);
export const deleteBook = (id) => api.delete(`/api/books/${id}`);
export const googleLogin = (token) => api.post('/auth/google', { token });
export default api;