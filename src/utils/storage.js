// Storage keys
const STORAGE_KEYS = {
  AUTH_TOKEN: 'cbt_auth_token',
  USER_DATA: 'cbt_user_data',
  EXAM_STATE: 'cbt_exam_state',
};

// Token Management (localStorage agar tidak hilang saat refresh)
export const tokenStorage = {
  get: () => localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
  set: (token) => localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token),
  remove: () => localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN),
};

// User Data Management (localStorage agar tidak hilang saat refresh)
export const userStorage = {
  get: () => {
    const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  },
  set: (userData) => localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData)),
  remove: () => localStorage.removeItem(STORAGE_KEYS.USER_DATA),
};

// Exam State Management (untuk auto-save recovery + timer persistence)
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

// Timer Persistence — disimpan terpisah supaya update tiap detik tidak
// memicu re-render pada state yang lebih besar.
const TIMER_KEY = 'cbt_timer';
export const timerStorage = {
  get: (examId) => {
    const data = localStorage.getItem(`${TIMER_KEY}_${examId}`);
    if (!data) return null;
    const { remaining, savedAt } = JSON.parse(data);
    // Koreksi waktu yang berlalu sejak terakhir disimpan
    const elapsedSeconds = Math.floor((Date.now() - savedAt) / 1000);
    const corrected = remaining - elapsedSeconds;
    return corrected > 0 ? corrected : 0;
  },
  set: (examId, remaining) => {
    localStorage.setItem(
      `${TIMER_KEY}_${examId}`,
      JSON.stringify({ remaining, savedAt: Date.now() })
    );
  },
  remove: (examId) => {
    localStorage.removeItem(`${TIMER_KEY}_${examId}`);
  },
};

// Clear all storage
export const clearAllStorage = () => {
  sessionStorage.clear();
  // Keep localStorage for other purposes, only clear exam states & timer
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(STORAGE_KEYS.EXAM_STATE) || key.startsWith('cbt_timer')) {
      localStorage.removeItem(key);
    }
  });
};
