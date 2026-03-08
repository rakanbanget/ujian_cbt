# Backend Integration Complete Guide

## Overview
The frontend is now fully integrated with the MFLS backend API. All mock data has been replaced with real API calls.

## What Was Integrated

### 1. Login System ✅
- **File**: `src/components/LoginPage.jsx`
- **Endpoint**: `POST /api/login`
- **Features**:
  - Email-based authentication
  - Token storage in localStorage
  - User data persistence
  - Error handling for invalid credentials

### 2. Exam Selection ✅
- **File**: `src/components/ExamSelectionPage.jsx`
- **Endpoint**: `GET /api/ujians`
- **Features**:
  - Dynamic loading of available exams from API
  - Automatic icon and color mapping based on exam name
  - Loading and error states
  - Retry functionality on error

### 3. Exam Questions ✅
- **File**: `src/contexts/ExamContext.jsx`
- **Endpoint**: `GET /api/soal?ujian_id={id}`
- **Features**:
  - Load questions from API
  - Map API format to frontend format:
    - `pertanyaan` → `question`
    - `opsi_a/b/c/d` → `options.A/B/C/D`
    - `gambar` → `image`
  - Auto-save to localStorage (not API)
  - State recovery on page refresh

### 4. Submit Answers ✅
- **File**: `src/contexts/ExamContext.jsx`, `src/components/ExamPage.jsx`
- **Endpoint**: `POST /api/soal/submit`
- **Features**:
  - Convert answers to lowercase (A → a, B → b)
  - Submit all answers at once
  - Handle "already submitted" error (400)
  - Display results (score, correct answers, etc.)
  - Clear localStorage after successful submit

## API Response Handling

### Login Response
```json
{
  "status": "success",
  "token": "1|ABC...",
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

## Configuration

### Environment Variables
File: `.env`
```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_ENV=development
```

### API Endpoints
File: `src/constants/apiEndpoints.js`
```javascript
export const AUTH_ENDPOINTS = {
  LOGIN: '/login',
  LOGOUT: '/logout',
  USER: '/user',
};

export const EXAM_ENDPOINTS = {
  LIST_UJIANS: '/ujians',
  GET_SOAL: '/soal',
  SUBMIT_JAWABAN: '/soal/submit',
};
```

## Testing the Integration

### Prerequisites
1. Backend server running at `http://127.0.0.1:8000`
2. CORS configured to allow `http://localhost:5173`
3. Valid user account in database

### Test Flow
1. **Start Backend**: Ensure Laravel backend is running
2. **Start Frontend**: `npm run dev`
3. **Login**: Use valid email and password
4. **Select Exam**: Choose from available exams
5. **Answer Questions**: Questions loaded from API
6. **Submit**: Answers submitted and results displayed

### Expected Behavior
- Login redirects to exam selection
- Exam cards load dynamically from API
- Questions display with proper formatting
- Submit shows score and correct answers
- Already submitted exams show previous score

## Error Handling

### Network Errors
- Display error message with retry button
- Maintain user session across errors
- Show loading states during API calls

### Authentication Errors
- Redirect to login on 401 Unauthorized
- Clear invalid tokens
- Show error message for invalid credentials

### Validation Errors
- Display API error messages
- Handle "already submitted" gracefully
- Prevent duplicate submissions

## Important Notes

### Auto-Save Behavior
- Answers are saved to **localStorage only**
- Backend does NOT support incremental saves
- Only final submission is sent to API
- LocalStorage cleared after successful submit

### Answer Format
- Frontend uses uppercase (A, B, C, D)
- Backend expects lowercase (a, b, c, d)
- Conversion happens automatically on submit

### Security
- Token stored in localStorage
- Token sent in Authorization header
- Security features (anti-cheat) still active
- Auto-submit on violations works with API

## Files Modified

### Core Integration Files
1. `src/api/authApi.js` - Login/logout API calls
2. `src/api/examApi.js` - Exam and question API calls
3. `src/contexts/AuthContext.jsx` - Authentication state
4. `src/contexts/ExamContext.jsx` - Exam state with API
5. `src/components/LoginPage.jsx` - Login UI with API
6. `src/components/ExamSelectionPage.jsx` - Dynamic exam loading
7. `src/components/ExamPage.jsx` - Submit with results display

### Configuration Files
1. `.env` - Backend URL configuration
2. `src/constants/apiEndpoints.js` - API endpoint definitions
3. `src/api/apiClient.js` - Axios instance with interceptors

## Next Steps

### Optional Enhancements
1. Add loading skeleton for exam cards
2. Implement retry logic for failed submissions
3. Add offline mode detection
4. Show detailed error messages from API
5. Add exam duration from API (currently hardcoded to 90 min)
6. Implement logout API call (currently only clears localStorage)

### Backend Coordination Needed
1. Confirm CORS configuration allows frontend origin
2. Verify token expiration handling
3. Test with real exam data
4. Confirm answer format (lowercase a/b/c/d)
5. Discuss exam duration field in API response

## Troubleshooting

### "Network Error" on Login
- Check backend is running at `http://127.0.0.1:8000`
- Verify CORS allows `http://localhost:5173`
- Check browser console for detailed error

### "Unauthorized" Error
- Token may be expired or invalid
- Clear localStorage and login again
- Check token format in Authorization header

### Questions Not Loading
- Verify ujian_id is valid
- Check user has permission to access exam
- Ensure backend returns correct format

### Submit Fails
- Check answer format (should be lowercase)
- Verify all required fields are sent
- Check for "already submitted" error

## Support

For issues or questions:
1. Check browser console for errors
2. Verify backend logs for API errors
3. Test API endpoints directly with Postman
4. Review this documentation for expected formats
