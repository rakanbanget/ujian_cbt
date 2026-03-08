# Integration Flow Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    React Frontend                          │  │
│  │                 (http://localhost:5173)                    │  │
│  │                                                             │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │  │
│  │  │  LoginPage   │  │ExamSelection │  │   ExamPage   │    │  │
│  │  │              │  │     Page     │  │              │    │  │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │  │
│  │         │                 │                  │             │  │
│  │         └─────────────────┼──────────────────┘             │  │
│  │                           │                                │  │
│  │  ┌────────────────────────▼─────────────────────────────┐ │  │
│  │  │              React Contexts                          │ │  │
│  │  │  ┌──────────────┐      ┌──────────────┐            │ │  │
│  │  │  │ AuthContext  │      │ ExamContext  │            │ │  │
│  │  │  │  - user      │      │  - questions │            │ │  │
│  │  │  │  - token     │      │  - answers   │            │ │  │
│  │  │  │  - login()   │      │  - submit()  │            │ │  │
│  │  │  └──────┬───────┘      └──────┬───────┘            │ │  │
│  │  └─────────┼─────────────────────┼────────────────────┘ │  │
│  │            │                     │                       │  │
│  │  ┌─────────▼─────────────────────▼────────────────────┐ │  │
│  │  │              API Layer                              │ │  │
│  │  │  ┌──────────────┐      ┌──────────────┐           │ │  │
│  │  │  │  authApi.js  │      │  examApi.js  │           │ │  │
│  │  │  │  - login()   │      │  - getUjians()│          │ │  │
│  │  │  │  - logout()  │      │  - getSoal() │           │ │  │
│  │  │  └──────┬───────┘      └──────┬───────┘           │ │  │
│  │  └─────────┼─────────────────────┼────────────────────┘ │  │
│  │            │                     │                       │  │
│  │  ┌─────────▼─────────────────────▼────────────────────┐ │  │
│  │  │            apiClient.js (Axios)                     │ │  │
│  │  │  - Base URL: http://127.0.0.1:8000/api             │ │  │
│  │  │  - Request Interceptor: Add Bearer Token           │ │  │
│  │  │  - Response Interceptor: Handle 401                │ │  │
│  │  └─────────────────────┬───────────────────────────────┘ │  │
│  │                        │                                  │  │
│  │  ┌─────────────────────▼───────────────────────────────┐ │  │
│  │  │            localStorage                              │ │  │
│  │  │  - token: "1|ABC..."                                │ │  │
│  │  │  - user: { nama, email, role }                      │ │  │
│  │  │  - exam_state_1: { answers, doubtful, ... }        │ │  │
│  │  └──────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             │ HTTP Requests
                             │ Authorization: Bearer {token}
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│                      Laravel Backend                              │
│                 (http://127.0.0.1:8000)                          │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    API Routes                              │  │
│  │                  (routes/api.php)                          │  │
│  │                                                             │  │
│  │  Public Routes:                                            │  │
│  │  POST /api/login ──────────────────────┐                  │  │
│  │                                         │                  │  │
│  │  Protected Routes (auth:sanctum):      │                  │  │
│  │  GET  /api/ujians ─────────────────┐   │                  │  │
│  │  GET  /api/soal ───────────────┐   │   │                  │  │
│  │  POST /api/soal/submit ────┐   │   │   │                  │  │
│  │  POST /api/logout ─────┐   │   │   │   │                  │  │
│  │  GET  /api/user ───┐   │   │   │   │   │                  │  │
│  └────────────────────┼───┼───┼───┼───┼───┼──────────────────┘  │
│                       │   │   │   │   │   │                     │
│  ┌────────────────────▼───▼───▼───▼───▼───▼──────────────────┐  │
│  │                    Controllers                             │  │
│  │  ┌──────────────────┐  ┌──────────────────┐              │  │
│  │  │  AuthController  │  │  SoalController  │              │  │
│  │  │  - login()       │  │  - getUjians()   │              │  │
│  │  │  - logout()      │  │  - index()       │              │  │
│  │  │  - me()          │  │  - submit()      │              │  │
│  │  └────────┬─────────┘  └────────┬─────────┘              │  │
│  └───────────┼─────────────────────┼────────────────────────┘  │
│              │                     │                            │
│  ┌───────────▼─────────────────────▼────────────────────────┐  │
│  │                    Models                                 │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐               │  │
│  │  │   User   │  │  Ujian   │  │   Soal   │               │  │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘               │  │
│  └───────┼─────────────┼─────────────┼───────────────────────┘  │
│          │             │             │                          │
│  ┌───────▼─────────────▼─────────────▼───────────────────────┐  │
│  │                    Database                                │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                │  │
│  │  │  users   │  │  ujians  │  │   soal   │                │  │
│  │  │  table   │  │  table   │  │  table   │                │  │
│  │  └──────────┘  └──────────┘  └──────────┘                │  │
│  └────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────┘
```

## Request Flow Examples

### 1. Login Flow

```
User enters credentials
        │
        ▼
┌───────────────────┐
│   LoginPage.jsx   │
│   handleSubmit()  │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│  authApi.login()  │
│  POST /api/login  │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│  apiClient.js     │
│  axios.post()     │
└─────────┬─────────┘
          │
          ▼ HTTP Request
┌─────────────────────────────┐
│  Backend: AuthController    │
│  - Validate credentials     │
│  - Create Sanctum token     │
│  - Return token + user data │
└─────────┬───────────────────┘
          │
          ▼ HTTP Response
┌───────────────────┐
│  AuthContext.jsx  │
│  - Store token    │
│  - Store user     │
│  - Update state   │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│  localStorage     │
│  - token: "1|..." │
│  - user: {...}    │
└─────────┬─────────┘
          │
          ▼
Navigate to /exam-selection
```

### 2. Load Exams Flow

```
ExamSelectionPage mounts
        │
        ▼
┌───────────────────────┐
│  examApi.getUjians()  │
│  GET /api/ujians      │
└─────────┬─────────────┘
          │
          ▼
┌───────────────────┐
│  apiClient.js     │
│  - Add token      │
│  - axios.get()    │
└─────────┬─────────┘
          │
          ▼ HTTP Request
          │ Authorization: Bearer {token}
┌─────────────────────────────┐
│  Backend: SoalController    │
│  - Verify token (Sanctum)   │
│  - Get ujians from DB       │
│  - Return ujian list        │
└─────────┬───────────────────┘
          │
          ▼ HTTP Response
          │ { status, data: [{ id, nama }] }
┌───────────────────────────┐
│  ExamSelectionPage.jsx    │
│  - Map to exam cards      │
│  - Display with icons     │
└───────────────────────────┘
```

### 3. Load Questions Flow

```
User clicks exam card
        │
        ▼
Navigate to /exam/:examId
        │
        ▼
┌───────────────────────┐
│  ExamContext.jsx      │
│  useEffect(examId)    │
└─────────┬─────────────┘
          │
          ▼
┌───────────────────────┐
│  examApi.getSoal()    │
│  GET /api/soal?id=1   │
└─────────┬─────────────┘
          │
          ▼
┌───────────────────┐
│  apiClient.js     │
│  - Add token      │
│  - axios.get()    │
└─────────┬─────────┘
          │
          ▼ HTTP Request
          │ Authorization: Bearer {token}
┌─────────────────────────────┐
│  Backend: SoalController    │
│  - Verify token             │
│  - Get soal from DB         │
│  - Randomize order          │
│  - Return questions         │
└─────────┬───────────────────┘
          │
          ▼ HTTP Response
          │ { ujian, data: [{ pertanyaan, opsi_a/b/c/d }] }
┌───────────────────────────┐
│  ExamContext.jsx          │
│  - Map API format         │
│  - Set questions state    │
│  - Start timer            │
└─────────┬─────────────────┘
          │
          ▼
┌───────────────────────────┐
│  ExamPage.jsx             │
│  - Display questions      │
│  - Enable navigation      │
└───────────────────────────┘
```

### 4. Submit Answers Flow

```
User clicks "Selesai Ujian"
        │
        ▼
┌───────────────────────┐
│  ReviewPage.jsx       │
│  - Show summary       │
│  - Confirm submit     │
└─────────┬─────────────┘
          │
          ▼
┌───────────────────────┐
│  ExamContext.jsx      │
│  handleSubmitExam()   │
└─────────┬─────────────┘
          │
          ▼
┌───────────────────────────┐
│  Convert answers          │
│  { "10": "A" } → "a"      │
└─────────┬─────────────────┘
          │
          ▼
┌───────────────────────────┐
│  examApi.submitJawaban()  │
│  POST /api/soal/submit    │
└─────────┬─────────────────┘
          │
          ▼
┌───────────────────┐
│  apiClient.js     │
│  - Add token      │
│  - axios.post()   │
└─────────┬─────────┘
          │
          ▼ HTTP Request
          │ Authorization: Bearer {token}
          │ Body: { ujian_id, answers }
┌─────────────────────────────┐
│  Backend: SoalController    │
│  - Verify token             │
│  - Check if already done    │
│  - Calculate score          │
│  - Save to DB               │
│  - Return results           │
└─────────┬───────────────────┘
          │
          ▼ HTTP Response
          │ { status, results: { score, correct_answers } }
┌───────────────────────────┐
│  ExamPage.jsx             │
│  - Display results        │
│  - Clear localStorage     │
│  - Navigate to selection  │
└───────────────────────────┘
```

## Data Format Transformations

### Questions: API → Frontend

```javascript
// API Response
{
  "status": "success",
  "ujian": "Ujian Akademik",
  "data": [
    {
      "id": 10,
      "pertanyaan": "What is 2+2?",
      "gambar": null,
      "opsi_a": "3",
      "opsi_b": "4",
      "opsi_c": "5",
      "opsi_d": "6",
      "bobot": 5
    }
  ]
}

// Frontend Format (ExamContext.jsx)
{
  id: 10,
  number: 1,
  question: "What is 2+2?",
  image: null,
  options: {
    A: "3",
    B: "4",
    C: "5",
    D: "6"
  },
  bobot: 5
}
```

### Answers: Frontend → API

```javascript
// Frontend Format (internal state)
{
  "10": "B",
  "11": "A",
  "12": "C"
}

// API Format (on submit)
{
  "ujian_id": 1,
  "answers": {
    "10": "b",
    "11": "a",
    "12": "c"
  }
}
```

## Security Flow

### Token Management

```
Login Success
     │
     ▼
┌─────────────────────┐
│  Store in           │
│  localStorage       │
│  key: "token"       │
│  value: "1|ABC..."  │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────────┐
│  Every API Request      │
│  apiClient interceptor  │
│  adds header:           │
│  Authorization: Bearer  │
└─────────┬───────────────┘
          │
          ▼
┌─────────────────────────┐
│  Backend validates      │
│  with Sanctum           │
│  middleware             │
└─────────┬───────────────┘
          │
          ├─── Valid ────► Continue
          │
          └─── Invalid ──► 401 Response
                           │
                           ▼
                    ┌──────────────────┐
                    │  Clear storage   │
                    │  Redirect login  │
                    └──────────────────┘
```

## Error Handling Flow

```
API Request
     │
     ├─── Success ────► Process Response
     │
     └─── Error ──────► apiClient interceptor
                        │
                        ├─── Network Error ──► Show "Connection Error"
                        │
                        ├─── 401 ──────────► Clear storage, redirect login
                        │
                        ├─── 400 ──────────► Show error message
                        │                     (e.g., "Already submitted")
                        │
                        ├─── 404 ──────────► Show "Not found"
                        │
                        └─── 500 ──────────► Show "Server error"
```

## State Management

```
┌─────────────────────────────────────────────────────────┐
│                    Application State                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  AuthContext (Global)                                   │
│  ├─ user: { nama, email, role }                        │
│  ├─ token: "1|ABC..."                                   │
│  ├─ isAuthenticated: boolean                            │
│  ├─ login(email, password)                              │
│  └─ logout()                                            │
│                                                          │
│  ExamContext (Per Exam)                                 │
│  ├─ exam: { id, title, duration }                      │
│  ├─ questions: [{ id, question, options }]             │
│  ├─ answers: { questionId: answer }                    │
│  ├─ doubtfulQuestions: Set<questionId>                 │
│  ├─ currentQuestionIndex: number                        │
│  ├─ timeRemaining: seconds                              │
│  ├─ setAnswer(questionId, answer)                      │
│  ├─ toggleDoubtful(questionId)                         │
│  └─ handleSubmitExam()                                  │
│                                                          │
│  localStorage (Persistent)                              │
│  ├─ token: "1|ABC..."                                   │
│  ├─ user: JSON string                                   │
│  └─ exam_state_{examId}: JSON string                   │
│     ├─ answers                                          │
│     ├─ doubtfulQuestions                                │
│     ├─ currentQuestionIndex                             │
│     └─ lastSaved                                        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

This visual representation shows how all components interact in the integrated system!
