# Platform CBT (Computer Based Test) - Frontend

Platform ujian online berbasis web menggunakan React.js dan Tailwind CSS.

## 🚀 Tech Stack

- **Frontend Framework**: React.js 18 (Vite)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **State Management**: Context API
- **Routing**: React Router DOM

## 📦 Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update API URL di .env
VITE_API_BASE_URL=http://your-backend-url/api
```

## 🏃 Running

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── api/                    # API integration
│   ├── apiClient.js       # Axios instance with interceptors
│   ├── authApi.js         # Authentication endpoints
│   └── examApi.js         # Exam endpoints
├── components/            # React components
│   ├── LoginPage.jsx
│   ├── ExamPage.jsx
│   ├── Timer.jsx
│   ├── QuestionGrid.jsx
│   ├── QuestionDisplay.jsx
│   ├── ReviewPage.jsx
│   ├── ConfirmModal.jsx
│   ├── LoadingSpinner.jsx
│   ├── NetworkStatus.jsx
│   ├── ErrorBoundary.jsx
│   └── ProtectedRoute.jsx
├── contexts/              # Context API
│   ├── AuthContext.jsx    # Authentication state
│   └── ExamContext.jsx    # Exam state & logic
├── hooks/                 # Custom hooks
│   ├── useAutoSave.js
│   ├── useNetworkStatus.js
│   └── useKeyboardNavigation.js
├── utils/                 # Utilities
│   └── storage.js         # localStorage/sessionStorage helpers
├── constants/             # Constants
│   └── apiEndpoints.js    # API endpoints
├── App.jsx
└── main.jsx
```

## 🔑 Key Features

### Authentication
- Login dengan nomor peserta & password
- Token-based authentication (Bearer)
- Auto-redirect saat session expired
- Protected routes

### Exam Management
- Real-time countdown timer
- Auto-save jawaban (debounced 3 seconds)
- Mark soal ragu-ragu
- Navigation grid (40 soal)
- Review page sebelum submit
- Keyboard shortcuts (Arrow keys, n/p)

### UX Enhancements
- Loading states dengan spinner
- Error handling dengan pesan user-friendly
- Network status indicator
- Confirmation modals
- Responsive design
- Offline state recovery

### State Management
- AuthContext: User session & authentication
- ExamContext: Exam data, answers, timer
- localStorage: Exam state recovery
- sessionStorage: Auth token

## 🔌 API Integration

### Endpoints yang digunakan:

```javascript
POST   /api/auth/login          // Login
GET    /api/exam/{examId}       // Get exam details
GET    /api/exam/{examId}/questions  // Get questions
POST   /api/exam/{examId}/answer     // Submit answer (auto-save)
POST   /api/exam/{examId}/submit     // Final submission
GET    /api/exam/{examId}/result     // Get result
```

### Request/Response Format:

**Login Request:**
```json
{
  "nomor_peserta": "12345",
  "password": "password123"
}
```

**Login Response:**
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "nomor_peserta": "12345",
    "nama": "John Doe"
  }
}
```

**Submit Answer Request:**
```json
{
  "question_id": 1,
  "answer": "A",
  "is_doubtful": false
}
```

## 🎯 Usage

### 1. Setup AuthProvider

```jsx
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      {/* Your app */}
    </AuthProvider>
  );
}
```

### 2. Protected Routes

```jsx
import { ProtectedRoute } from './components/ProtectedRoute';

<Route path="/exam/:examId" element={
  <ProtectedRoute>
    <ExamPage />
  </ProtectedRoute>
} />
```

### 3. Use Exam Context

```jsx
import { useExam } from './contexts/ExamContext';

function ExamPage() {
  const {
    currentQuestion,
    setAnswer,
    nextQuestion,
    handleSubmitExam
  } = useExam();
  
  // Your component logic
}
```

## 🔒 Security

- Token disimpan di sessionStorage (auto-clear saat tab ditutup)
- Auto-logout saat token expired
- Request interceptor untuk attach token
- Response interceptor untuk handle 401
- XSS prevention (React default)

## 🎨 Customization

### Tailwind Config
Edit `tailwind.config.js` untuk custom theme

### API Base URL
Edit `.env` file:
```
VITE_API_BASE_URL=http://your-api-url
```

### Timer Duration
Durasi timer dari API response (`exam.duration` dalam menit)

## 📝 Notes

- Auto-save: Jawaban disimpan otomatis setiap 3 detik
- Timer: Auto-submit saat waktu habis
- Recovery: State tersimpan di localStorage untuk recovery
- Network: Indicator muncul saat offline
- Keyboard: Arrow keys untuk navigasi, Ctrl+Enter untuk submit

## 🐛 Troubleshooting

**CORS Error:**
- Pastikan backend sudah enable CORS
- Check API_BASE_URL di .env

**Token Expired:**
- User akan auto-redirect ke login
- Session storage akan di-clear

**Network Error:**
- Check koneksi internet
- Verify API endpoint accessible

## 📞 Backend Coordination

Yang perlu dikonfirmasi dengan backend team:

1. **API Contract**: Struktur request/response
2. **Error Format**: Standardized error response
3. **Token Format**: Bearer token format
4. **CORS**: Allowed origins
5. **Rate Limiting**: Request limits
6. **Response Time**: Expected latency
7. **Exam Duration**: Format (minutes/seconds)
8. **Question Format**: Structure & options

## 🚀 Production Checklist

- [ ] Environment variables configured
- [ ] API endpoints tested
- [ ] Error handling verified
- [ ] Loading states implemented
- [ ] Network error handling
- [ ] Token expiry handling
- [ ] Mobile responsive tested
- [ ] Browser compatibility checked
- [ ] Performance optimized
- [ ] Security review done

## 📄 License

Private - Internal Use Only
