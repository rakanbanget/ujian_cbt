# Quick API Reference Card

## 🚀 Quick Start
```bash
# Backend
php artisan serve  # http://127.0.0.1:8000

# Frontend
npm run dev        # http://localhost:5173
```

## 🔑 API Endpoints

### Login
```http
POST /api/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "device_name": "web_browser"
}

Response: { status, token, user }
```

### Get Exams
```http
GET /api/ujians
Authorization: Bearer {token}

Response: { status, data: [{ id, nama }] }
```

### Get Questions
```http
GET /api/soal?ujian_id=1
Authorization: Bearer {token}

Response: { status, ujian, data: [{ id, pertanyaan, opsi_a/b/c/d }] }
```

### Submit Answers
```http
POST /api/soal/submit
Authorization: Bearer {token}
Content-Type: application/json

{
  "ujian_id": 1,
  "answers": { "10": "a", "11": "c" }
}

Response: { status, results: { score, correct_answers, ... } }
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/api/authApi.js` | Login/logout functions |
| `src/api/examApi.js` | Exam/question functions |
| `src/contexts/ExamContext.jsx` | Exam state + API calls |
| `src/components/ExamSelectionPage.jsx` | Load exams from API |
| `.env` | Backend URL config |

## 🔧 Configuration

### .env
```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

### CORS (Backend)
```php
'allowed_origins' => ['http://localhost:5173']
```

## 🐛 Quick Debug

### Check Token
```javascript
localStorage.getItem('token')
```

### Check User
```javascript
JSON.parse(localStorage.getItem('user'))
```

### Clear All
```javascript
localStorage.clear()
location.reload()
```

## ✅ Test Flow

1. Login → Token stored
2. Select Exam → Load from API
3. Answer Questions → Save to localStorage
4. Submit → Send to API, show results
5. Try again → "Already submitted" error

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| Network Error | Check backend running |
| CORS Error | Configure backend CORS |
| Unauthorized | Clear localStorage, login again |
| Already Submitted | Expected, shows previous score |

## 📊 Data Format

### Frontend → API (Answers)
```javascript
// Frontend uses uppercase
{ "10": "A", "11": "B" }

// Converted to lowercase for API
{ "10": "a", "11": "b" }
```

### API → Frontend (Questions)
```javascript
// API format
{ pertanyaan, opsi_a, opsi_b, opsi_c, opsi_d }

// Frontend format
{ question, options: { A, B, C, D } }
```

## 📚 Documentation

- `BACKEND_INTEGRATION_COMPLETE.md` - Full integration guide
- `TESTING_GUIDE.md` - Testing instructions
- `API_INTEGRATION_STATUS.md` - Integration status
- `QUICK_API_REFERENCE.md` - This file

## 🎯 Status

✅ Login Integration
✅ Exam Selection Integration
✅ Questions Integration
✅ Submit Integration
✅ Error Handling
✅ Results Display
✅ Security Features

**Ready for Backend Testing!**
