# 🔌 API Integration - MFLS Backend

## ✅ Status: READY FOR INTEGRATION

Frontend sudah diupdate untuk connect ke API MFLS.

---

## 🔧 Configuration

### 1. Update .env File

```bash
VITE_API_BASE_URL=http://api-mfls.test/api
```

**Sesuaikan dengan domain backend:**
- Local: `http://api-mfls.test/api`
- Staging: `https://staging-api.mfls.com/api`
- Production: `https://api.mfls.com/api`

### 2. CORS Configuration (Backend)

Backend harus enable CORS untuk frontend domain:

```php
// config/cors.php
'allowed_origins' => [
    'http://localhost:5173',  // Development
    'https://your-frontend-domain.com',  // Production
],
```

---

## 📡 API Endpoints Mapping

### Authentication

| Frontend Function | API Endpoint | Method | Body |
|------------------|--------------|--------|------|
| `authApi.login()` | `/api/login` | POST | `{ email, password, device_name }` |
| `authApi.logout()` | `/api/logout` | POST | - |
| `authApi.getUser()` | `/api/user` | GET | - |

### Ujian & Soal

| Frontend Function | API Endpoint | Method | Params |
|------------------|--------------|--------|--------|
| `examApi.getUjians()` | `/api/ujians` | GET | - |
| `examApi.getSoal()` | `/api/soal` | GET | `?ujian_id={id}` |
| `examApi.submitJawaban()` | `/api/soal/submit` | POST | `{ ujian_id, answers }` |

---

## 🔄 Data Flow

### 1. Login Flow

```
User Input (email, password)
    ↓
authApi.login(email, password, 'web_browser')
    ↓
POST /api/login
    ↓
Response: { token, user }
    ↓
Save to sessionStorage
    ↓
Navigate to /select-exam
```

### 2. Exam Selection Flow

```
Load Page
    ↓
examApi.getUjians()
    ↓
GET /api/ujians
    ↓
Response: [{ id, nama }, ...]
    ↓
Display exam cards (TPA, TBI, TPU)
    ↓
User selects exam
    ↓
Navigate to /exam/{ujianId}
```

### 3. Exam Flow

```
Load Exam Page
    ↓
examApi.getSoal(ujianId)
    ↓
GET /api/soal?ujian_id={id}
    ↓
Response: { ujian, data: [questions] }
    ↓
Display questions
    ↓
User answers questions (saved locally)
    ↓
User clicks "Submit"
    ↓
examApi.submitJawaban(ujianId, answers)
    ↓
POST /api/soal/submit
    ↓
Response: { results: { score, correct_answers, ... } }
    ↓
Display results
```

---

## 📝 Request/Response Format

### Login Request

```json
POST /api/login
{
  "email": "user@example.com",
  "password": "password123",
  "device_name": "web_browser"
}
```

### Login Response (Success)

```json
{
  "status": "success",
  "token": "1|ABC123...",
  "user": {
    "nama": "User Name",
    "email": "user@example.com",
    "role": "pendaftar"
  }
}
```

### Get Ujians Response

```json
{
  "status": "success",
  "data": [
    { "id": 1, "nama": "Ujian Akademik" },
    { "id": 2, "nama": "Tes Potensi" }
  ]
}
```

### Get Soal Response

```json
{
  "status": "success",
  "ujian": "Ujian Akademik",
  "data": [
    {
      "id": 10,
      "pertanyaan": "Apa ibukota Indonesia?",
      "gambar": null,
      "opsi_a": "Jakarta",
      "opsi_b": "Bandung",
      "opsi_c": "Surabaya",
      "opsi_d": "Medan",
      "bobot": 5
    }
  ]
}
```

### Submit Jawaban Request

```json
POST /api/soal/submit
{
  "ujian_id": 1,
  "answers": {
    "10": "a",
    "11": "c",
    "12": "b"
  }
}
```

### Submit Jawaban Response (Success)

```json
{
  "status": "success",
  "message": "Jawaban berhasil disimpan.",
  "results": {
    "earned_raw_score": 85,
    "max_raw_score": 100,
    "score": 85.00,
    "correct_answers": 17,
    "total_questions": 20
  }
}
```

### Submit Jawaban Response (Already Submitted)

```json
{
  "status": "error",
  "message": "Anda sudah mengerjakan ujian ini sebelumnya.",
  "score": 85
}
```

---

## 🔄 Frontend Adaptations

### 1. Question Format Mapping

**API Format:**
```json
{
  "id": 10,
  "pertanyaan": "Question text",
  "opsi_a": "Option A",
  "opsi_b": "Option B",
  "opsi_c": "Option C",
  "opsi_d": "Option D"
}
```

**Frontend Format (needs mapping):**
```javascript
{
  id: 10,
  number: 1,
  question: "Question text",
  options: {
    A: "Option A",
    B: "Option B",
    C: "Option C",
    D: "Option D"
  }
}
```

### 2. Answer Format Mapping

**Frontend Format:**
```javascript
{
  10: "A",  // questionId: answer
  11: "C",
  12: "B"
}
```

**API Format (needs conversion):**
```javascript
{
  "10": "a",  // lowercase
  "11": "c",
  "12": "b"
}
```

---

## 🛠️ Implementation Steps

### Step 1: Update ExamContext

File: `src/contexts/ExamContext.jsx`

**Load Soal:**
```javascript
// Replace mock data with real API call
const questionsResult = await examApi.getSoal(examId);

// Map API format to frontend format
const mappedQuestions = questionsResult.data.questions.map((q, index) => ({
  id: q.id,
  number: index + 1,
  question: q.pertanyaan,
  image: q.gambar,
  options: {
    A: q.opsi_a,
    B: q.opsi_b,
    C: q.opsi_c,
    D: q.opsi_d,
  },
  bobot: q.bobot
}));
```

**Submit Answers:**
```javascript
// Convert answers to API format (lowercase)
const apiAnswers = {};
Object.keys(answers).forEach(questionId => {
  apiAnswers[questionId] = answers[questionId].toLowerCase();
});

// Submit to API
const result = await examApi.submitJawaban(examId, apiAnswers);
```

### Step 2: Update ExamSelectionPage

File: `src/components/ExamSelectionPage.jsx`

**Load Ujians:**
```javascript
useEffect(() => {
  const loadUjians = async () => {
    const result = await examApi.getUjians();
    if (result.success) {
      setUjians(result.data);
    }
  };
  loadUjians();
}, []);
```

### Step 3: Handle Already Submitted

```javascript
const result = await examApi.submitJawaban(examId, apiAnswers);

if (!result.success && result.alreadySubmitted) {
  alert(`Anda sudah mengerjakan ujian ini. Skor: ${result.score}`);
  navigate('/select-exam');
  return;
}
```

---

## 🧪 Testing Checklist

### Authentication
- [ ] Login dengan email & password valid
- [ ] Login dengan credentials invalid (error handling)
- [ ] Logout
- [ ] Token saved to sessionStorage
- [ ] Token sent in Authorization header

### Ujian List
- [ ] Load list ujians dari API
- [ ] Display ujian cards
- [ ] Click ujian → navigate to exam page

### Exam Flow
- [ ] Load soal dari API
- [ ] Display questions correctly
- [ ] Answer selection works
- [ ] Submit answers to API
- [ ] Display results
- [ ] Handle "already submitted" error

### Error Handling
- [ ] Network error
- [ ] 401 Unauthorized (auto-logout)
- [ ] 400 Bad Request (already submitted)
- [ ] 500 Server Error

---

## 🐛 Common Issues & Solutions

### Issue 1: CORS Error

**Error:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
Backend harus enable CORS untuk frontend domain.

### Issue 2: 401 Unauthorized

**Error:**
```
Unauthorized
```

**Solution:**
- Check token di sessionStorage
- Verify token format: `Bearer {token}`
- Check token expiry

### Issue 3: Question Format Mismatch

**Error:**
```
Cannot read property 'options' of undefined
```

**Solution:**
Map API format ke frontend format (lihat Step 1).

### Issue 4: Already Submitted

**Error:**
```
Anda sudah mengerjakan ujian ini sebelumnya
```

**Solution:**
Handle error dengan redirect ke exam selection.

---

## 📊 Next Steps

1. **Update ExamContext** untuk load real data
2. **Update ExamSelectionPage** untuk load ujians
3. **Test login flow** dengan real credentials
4. **Test exam flow** end-to-end
5. **Handle edge cases** (already submitted, errors)
6. **Deploy** to staging for testing

---

## 🔒 Security Notes

- Token stored in sessionStorage (auto-clear on tab close)
- Token sent in Authorization header
- Auto-logout on 401 Unauthorized
- HTTPS only in production

---

**Status: ✅ READY FOR INTEGRATION**

**Next Action: Update ExamContext & ExamSelectionPage**
