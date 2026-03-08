# Testing Guide - API Integration

## Quick Start Testing

### 1. Start Backend Server
```bash
# Navigate to backend directory
cd /path/to/mfls-backend

# Start Laravel server
php artisan serve
# Should run at http://127.0.0.1:8000
```

### 2. Start Frontend Server
```bash
# In this directory
npm run dev
# Should run at http://localhost:5173
```

### 3. Test Login
1. Open browser to `http://localhost:5173`
2. Enter valid credentials:
   - Email: (ask your backend team)
   - Password: (ask your backend team)
3. Click "Masuk"
4. Should redirect to exam selection page

### 4. Test Exam Selection
1. After login, you should see exam cards
2. Cards are loaded from API (`GET /api/ujians`)
3. Click any exam card to start

### 5. Test Exam Questions
1. Questions load from API (`GET /api/soal?ujian_id={id}`)
2. Answer some questions
3. Navigate between questions
4. Mark some as "Ragu-ragu" (doubtful)
5. Answers save to localStorage automatically

### 6. Test Submit
1. Click "Selesai Ujian" button
2. Review your answers
3. Click "Submit Ujian"
4. Confirm submission
5. Should see results:
   - Score percentage
   - Correct answers count
   - Raw score
6. Redirects to exam selection

## Testing Scenarios

### Scenario 1: First Time User
```
1. Login with valid credentials
2. Select TPA exam
3. Answer all questions
4. Submit exam
5. See results
6. Return to exam selection
7. Try to take TPA again
8. Should see "already submitted" message
```

### Scenario 2: Partial Completion
```
1. Login
2. Select TBI exam
3. Answer 5 questions
4. Close browser tab
5. Open browser again
6. Login
7. Select TBI exam
8. Should restore previous answers
9. Continue from where you left off
```

### Scenario 3: Security Violations
```
1. Login and start exam
2. Try to switch tabs (Violation 1)
3. Try to exit fullscreen (Violation 2)
4. Try to open DevTools (Violation 3)
5. One more violation triggers auto-submit
6. Exam submits automatically
7. See results with warning message
```

### Scenario 4: Time Expires
```
1. Login and start exam
2. Wait for timer to reach 0
3. Exam auto-submits
4. See results
```

## API Testing with Postman

### 1. Login
```
POST http://127.0.0.1:8000/api/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "device_name": "web_browser"
}

Expected Response:
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

### 2. Get Ujians
```
GET http://127.0.0.1:8000/api/ujians
Authorization: Bearer {token_from_login}
Accept: application/json

Expected Response:
{
  "status": "success",
  "data": [
    { "id": 1, "nama": "Ujian Akademik" },
    { "id": 2, "nama": "Tes Potensi" }
  ]
}
```

### 3. Get Soal
```
GET http://127.0.0.1:8000/api/soal?ujian_id=1
Authorization: Bearer {token_from_login}
Accept: application/json

Expected Response:
{
  "status": "success",
  "ujian": "Ujian Akademik",
  "data": [
    {
      "id": 10,
      "pertanyaan": "Question text?",
      "gambar": null,
      "opsi_a": "Option A",
      "opsi_b": "Option B",
      "opsi_c": "Option C",
      "opsi_d": "Option D",
      "bobot": 5
    }
  ]
}
```

### 4. Submit Jawaban
```
POST http://127.0.0.1:8000/api/soal/submit
Authorization: Bearer {token_from_login}
Content-Type: application/json
Accept: application/json

{
  "ujian_id": 1,
  "answers": {
    "10": "a",
    "11": "c",
    "12": "b"
  }
}

Expected Response:
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

## Common Issues

### Issue: "Network Error" on Login
**Solution**: 
- Check backend is running: `curl http://127.0.0.1:8000/api/login`
- Check CORS configuration in backend
- Open browser console for detailed error

### Issue: "Unauthorized" Error
**Solution**:
- Token expired or invalid
- Clear localStorage: `localStorage.clear()`
- Login again

### Issue: Questions Not Loading
**Solution**:
- Check ujian_id is valid
- Verify user has permission
- Check backend logs for errors

### Issue: Submit Returns 400 "Already Submitted"
**Solution**:
- This is expected if you already took the exam
- Frontend shows previous score
- Backend prevents duplicate submissions

### Issue: CORS Error
**Solution**:
Backend needs to allow `http://localhost:5173`:
```php
// In backend config/cors.php
'allowed_origins' => ['http://localhost:5173'],
```

## Browser Console Debugging

### Check Token
```javascript
// In browser console
localStorage.getItem('token')
```

### Check User Data
```javascript
// In browser console
JSON.parse(localStorage.getItem('user'))
```

### Check Saved Answers
```javascript
// In browser console
localStorage.getItem('exam_state_1') // for exam ID 1
```

### Clear All Data
```javascript
// In browser console
localStorage.clear()
location.reload()
```

## Backend Requirements Checklist

- [ ] Backend running at `http://127.0.0.1:8000`
- [ ] CORS allows `http://localhost:5173`
- [ ] Database has test user account
- [ ] Database has ujian records
- [ ] Database has soal records for each ujian
- [ ] Login endpoint returns token
- [ ] Ujians endpoint returns list
- [ ] Soal endpoint returns questions
- [ ] Submit endpoint accepts answers and returns results
- [ ] Submit endpoint prevents duplicate submissions

## Success Criteria

✅ User can login with valid credentials
✅ Exam cards load from API
✅ Questions load from API
✅ Answers save to localStorage
✅ Submit sends answers to API
✅ Results display correctly
✅ Already submitted exams show previous score
✅ Security features work (violations, auto-submit)
✅ Timer works and auto-submits at 0
✅ Logout clears session

## Next Steps After Testing

1. Test with real exam data
2. Test with multiple users
3. Test concurrent submissions
4. Test network interruptions
5. Test on different browsers
6. Test on mobile devices
7. Performance testing with many questions
8. Security testing (try to bypass protections)

## Contact

If you encounter issues:
1. Check this guide first
2. Check browser console
3. Check backend logs
4. Test API with Postman
5. Contact backend team for API issues
6. Contact frontend team for UI issues
