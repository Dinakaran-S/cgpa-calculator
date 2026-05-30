import axios from 'axios';

// Base URL — Vite proxies /api to localhost:5000 in dev
const api = axios.create({
  baseURL: 'https://cgpa-calculator-backend-5cmz.onrender.com/api',
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If 401 comes back, clear token (session expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
