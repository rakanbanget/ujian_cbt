# 🚀 Quick Reference Card

## 📦 Installation

```bash
npm install
cp .env.example .env
# Edit .env dengan API URL
npm run dev
```

## 🔑 Key Concepts

### 1. Authentication (AuthContext)

```jsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // Login
  const result = await login(nomorPeserta, password);
  if (result.success) {
    // Success
  }
  
  // Logout
  await logout();
}
```

### 2. Exam Management (ExamContext)

```jsx
import { useExam } from '../contexts/ExamContext';

function ExamComponent() {
  const {
    exam,                    // Exam data
    questions,               // Array of questions
    currentQuestion,         // Current question object
    currentQuestionIndex,    // Current index
    answers,                 // Object { questionId: answer }
    doubtfulQuestions,       // Set of doubtful question IDs
    timeRemaining,           // Seconds remaining
    isLoading,               // Loading state
    isSaving,                // Saving state
    setAnswer,               // (questionId, answer) => void
    toggleDoubtful,          // (questionId) => void
    nextQuestion,            // () => void
    previousQuestion,        // () => void
    goToQuestion,            // (index) => void
    handleSubmitExam,        // () => Promise<result>
    answeredCount,           // Number of answered questions
    doubtfulCount,           // Number of doubtful questions
  } = useExam();
}
```

### 3. API Calls

```jsx
import { authApi } from '../api/authApi';
import { examApi } from '../api/examApi';

// Login
const result = await authApi.login(nomorPeserta, password);

// Get exam
const result = await examApi.getExam(examId);

// Get questions
const result = await examApi.getQuestions(examId);

// Submit answer
const result = await examApi.submitAnswer(examId, questionId, answer, isDoubtful);

// Submit exam
const result = await examApi.submitExam(examId);

// Get result
const result = await examApi.getResult(examId);
```

### 4. Storage

```jsx
import { tokenStorage, userStorage, examStateStorage } from '../utils/storage';

// Token
tokenStorage.set(token);
const token = tokenStorage.get();
tokenStorage.remove();

// User
userStorage.set(userData);
const user = userStorage.get();
userStorage.remove();

// Exam state
examStateStorage.set(examId, state);
const state = examStateStorage.get(examId);
examStateStorage.remove(examId);
```

## 🎨 Components

### LoadingSpinner

```jsx
import { LoadingSpinner } from './LoadingSpinner';

<LoadingSpinner size="sm" text="Loading..." />
// size: 'sm' | 'md' | 'lg'
```

### ConfirmModal

```jsx
import { ConfirmModal } from './ConfirmModal';

<ConfirmModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onConfirm={handleConfirm}
  title="Konfirmasi"
  message="Apakah Anda yakin?"
  confirmText="Ya"
  cancelText="Batal"
  isDestructive={false}
/>
```

### NetworkStatus

```jsx
import { NetworkStatus } from './NetworkStatus';

<NetworkStatus />
// Auto-shows when offline
```

### ProtectedRoute

```jsx
import { ProtectedRoute } from './ProtectedRoute';

<Route path="/exam/:id" element={
  <ProtectedRoute>
    <ExamPage />
  </ProtectedRoute>
} />
```

### ReviewPage

```jsx
import { ReviewPage } from './ReviewPage';

<ReviewPage
  onClose={() => setShowReview(false)}
  onSubmit={handleSubmit}
/>
```

## 🪝 Custom Hooks

### useKeyboardNavigation

```jsx
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';

useKeyboardNavigation({
  onNext: () => console.log('Next'),
  onPrevious: () => console.log('Previous'),
  onSubmit: () => console.log('Submit'),
  enabled: true,
});
// Arrow keys, n/p, Ctrl+Enter
```

### useNetworkStatus

```jsx
import { useNetworkStatus } from '../hooks/useNetworkStatus';

const { isOnline, wasOffline } = useNetworkStatus();
```

### useAutoSave

```jsx
import { useAutoSave } from '../hooks/useAutoSave';

const { trigger, flush } = useAutoSave(
  async () => {
    // Save logic
  },
  3000 // delay in ms
);

// Trigger save (debounced)
trigger();

// Force immediate save
flush();
```

## 🔧 Configuration

### Environment Variables (.env)

```bash
VITE_API_BASE_URL=http://localhost:8000/api
VITE_ENV=development
```

### API Endpoints (src/constants/apiEndpoints.js)

```javascript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
};

export const EXAM_ENDPOINTS = {
  GET_EXAM: (examId) => `/exam/${examId}`,
  GET_QUESTIONS: (examId) => `/exam/${examId}/questions`,
  SUBMIT_ANSWER: (examId) => `/exam/${examId}/answer`,
  SUBMIT_EXAM: (examId) => `/exam/${examId}/submit`,
  GET_RESULT: (examId) => `/exam/${examId}/result`,
};
```

## 🎯 Common Patterns

### Protected Page

```jsx
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';

function MyPage() {
  const { user } = useAuth();
  return <div>Hello {user.nama}</div>;
}

// In routes
<Route path="/my-page" element={
  <ProtectedRoute>
    <MyPage />
  </ProtectedRoute>
} />
```

### Exam Page with Provider

```jsx
import { ExamProvider, useExam } from './contexts/ExamContext';
import { useParams } from 'react-router-dom';

function ExamContent() {
  const { currentQuestion, setAnswer } = useExam();
  // Your component logic
}

export default function ExamPage() {
  const { examId } = useParams();
  return (
    <ExamProvider examId={examId}>
      <ExamContent />
    </ExamProvider>
  );
}
```

### Error Handling

```jsx
const result = await authApi.login(nomor, password);

if (result.success) {
  // Success
  navigate('/exam/1');
} else {
  // Error
  setError(result.error);
}
```

### Loading State

```jsx
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async () => {
  setIsLoading(true);
  const result = await api.call();
  setIsLoading(false);
};

return (
  <button disabled={isLoading}>
    {isLoading ? <LoadingSpinner size="sm" /> : 'Submit'}
  </button>
);
```

## 🐛 Debugging

### Check Token

```javascript
// Browser console
sessionStorage.getItem('cbt_auth_token')
```

### Check User Data

```javascript
// Browser console
JSON.parse(sessionStorage.getItem('cbt_user_data'))
```

### Check Exam State

```javascript
// Browser console
JSON.parse(localStorage.getItem('cbt_exam_state_1'))
```

### Check API Calls

1. Open DevTools (F12)
2. Go to Network tab
3. Filter by XHR
4. Check request/response

### Check Errors

1. Open DevTools (F12)
2. Go to Console tab
3. Look for red errors

## 📊 Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "type": "ERROR_TYPE",
  "status": 400
}
```

## ⌨️ Keyboard Shortcuts

- `Arrow Right` or `n` - Next question
- `Arrow Left` or `p` - Previous question
- `Ctrl + Enter` - Submit exam
- `Tab` - Navigate between elements
- `Enter` - Select/confirm

## 🔒 Security Notes

- Token stored in sessionStorage (auto-clear on tab close)
- Token sent in Authorization header
- Auto-logout on 401 Unauthorized
- HTTPS only in production
- No sensitive data in URL

## 📱 Responsive Breakpoints

```css
/* Tailwind breakpoints */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

## 🎨 Color Scheme

```javascript
// Status colors
Active: blue-600
Answered: green-500
Doubtful: yellow-500
Unanswered: gray-200

// UI colors
Primary: blue-600
Success: green-600
Warning: yellow-500
Error: red-600
```

## 📞 Quick Help

**CORS Error?**
→ Backend must enable CORS for your domain

**401 Unauthorized?**
→ Check token in sessionStorage, try re-login

**Network Error?**
→ Check API URL in .env, verify backend running

**Questions not loading?**
→ Check API response format, verify endpoint

**Auto-save not working?**
→ Check Network tab, verify API endpoint

## 📚 Documentation Files

- `README.md` - Project overview & setup
- `ARCHITECTURE.md` - Architecture & best practices
- `BACKEND_COORDINATION.md` - Backend coordination
- `INTEGRATION_GUIDE.md` - Integration steps
- `QUICK_START.md` - Quick start guide
- `PROJECT_SUMMARY.md` - Project summary
- `CHECKLIST.md` - Implementation checklist
- `QUICK_REFERENCE.md` - This file

## 🚀 Quick Commands

```bash
# Development
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Lint
npm run lint
```

## 💡 Pro Tips

1. **Use React DevTools** for debugging state
2. **Check Network tab** for API issues
3. **Use Console** for errors
4. **Test on multiple browsers**
5. **Test on mobile devices**
6. **Read error messages carefully**
7. **Check documentation when stuck**
8. **Ask backend team for API issues**

---

**Need more help?** Check the full documentation files listed above.
