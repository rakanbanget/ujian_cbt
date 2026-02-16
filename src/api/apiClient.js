import axios from 'axios';
import { API_BASE_URL, HTTP_STATUS } from '../constants/apiEndpoints';
import { tokenStorage, clearAllStorage } from '../utils/storage';

// Create axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - attach token
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error
    if (!error.response) {
      return Promise.reject({
        message: 'Koneksi internet bermasalah. Silakan cek koneksi Anda.',
        type: 'NETWORK_ERROR',
        originalError: error,
      });
    }

    const { status, data } = error.response;

    // Handle specific status codes
    switch (status) {
      case HTTP_STATUS.UNAUTHORIZED:
        // Token expired or invalid
        clearAllStorage();
        window.location.href = '/login?session=expired';
        return Promise.reject({
          message: 'Sesi Anda telah berakhir. Silakan login kembali.',
          type: 'AUTH_ERROR',
          status,
        });

      case HTTP_STATUS.FORBIDDEN:
        return Promise.reject({
          message: 'Anda tidak memiliki akses untuk melakukan aksi ini.',
          type: 'FORBIDDEN_ERROR',
          status,
        });

      case HTTP_STATUS.NOT_FOUND:
        return Promise.reject({
          message: data?.message || 'Data tidak ditemukan.',
          type: 'NOT_FOUND_ERROR',
          status,
        });

      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        return Promise.reject({
          message: 'Terjadi kesalahan pada server. Silakan coba lagi.',
          type: 'SERVER_ERROR',
          status,
        });

      default:
        return Promise.reject({
          message: data?.message || 'Terjadi kesalahan. Silakan coba lagi.',
          type: 'API_ERROR',
          status,
          data,
        });
    }
  }
);

export default apiClient;
