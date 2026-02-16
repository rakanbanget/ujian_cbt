// API Base URL - Menggunakan /api agar melewati Proxy Vite (Bypass CORS)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Auth Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/login',
  LOGOUT: '/logout',
  USER: '/user',
};

// Exam Endpoints
export const EXAM_ENDPOINTS = {
  LIST_UJIANS: '/ujians',
  GET_SOAL: '/soal',
  SUBMIT_JAWABAN: '/soal/submit',
};

// Pengumuman Endpoints
export const PENGUMUMAN_ENDPOINTS = {
  CEK_PENGUMUMAN: '/cek-pengumuman',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
