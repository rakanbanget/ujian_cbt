// Storage keys
const STORAGE_KEYS = {
  AUTH_TOKEN: 'cbt_auth_token',
  USER_DATA: 'cbt_user_data',
  EXAM_STATE: 'cbt_exam_state',
};

// Token Management
export const tokenStorage = {
  get: () => sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
  set: (token) => sessionStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token),
  remove: () => sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN),
};

// User Data Management
export const userStorage = {
  get: () => {
    const data = sessionStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  },
  set: (userData) => sessionStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData)),
  remove: () => sessionStorage.removeItem(STORAGE_KEYS.USER_DATA),
};

// Exam State Management (untuk auto-save recovery)
export const examStateStorage = {
  get: (examId) => {
    const data = localStorage.getItem(`${STORAGE_KEYS.EXAM_STATE}_${examId}`);
    return data ? JSON.parse(data) : null;
  },
  set: (examId, state) => {
    localStorage.setItem(`${STORAGE_KEYS.EXAM_STATE}_${examId}`, JSON.stringify(state));
  },
  remove: (examId) => {
    localStorage.removeItem(`${STORAGE_KEYS.EXAM_STATE}_${examId}`);
  },
};

// Clear all storage
export const clearAllStorage = () => {
  sessionStorage.clear();
  // Keep localStorage for other purposes, only clear exam states
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(STORAGE_KEYS.EXAM_STATE)) {
      localStorage.removeItem(key);
    }
  });
};
