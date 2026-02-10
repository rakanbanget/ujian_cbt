# Backend Coordination Checklist

## 📝 API Contract & Documentation

### 1. Request/Response Format

**Yang perlu dikonfirmasi:**

#### Login Endpoint
```
POST /api/auth/login

Request:
{
  "nomor_peserta": "string",
  "password": "string"
}

Response (Success):
{
  "token": "string",
  "user": {
    "id": number,
    "nomor_peserta": "string",
    "nama": "string",
    "email": "string" (optional)
  }
}

Response (Error):
{
  "message": "string",
  "errors": {} (optional, untuk validation errors)
}
```

#### Get Exam
```
GET /api/exam/{examId}

Response:
{
  "id": number,
  "title": "string",
  "description": "string",
  "duration": number, // dalam menit
  "total_questions": number,
  "start_time": "ISO 8601 datetime",
  "end_time": "ISO 8601 datetime"
}
```

#### Get Questions
```
GET /api/exam/{examId}/questions

Response:
{
  "questions": [
    {
      "id": number,
      "number": number,
      "question": "string",
      "options": {
        "A": "string",
        "B": "string",
        "C": "string",
        "D": "string",
        "E": "string"
      },
      "image": "string (URL)" (optional)
    }
  ]
}
```

#### Submit Answer
```
POST /api/exam/{examId}/answer

Request:
{
  "question_id": number,
  "answer": "string", // A, B, C, D, atau E
  "is_doubtful": boolean
}

Response:
{
  "success": boolean,
  "message": "string"
}
```

#### Submit Exam
```
POST /api/exam/{examId}/submit

Response:
{
  "success": boolean,
  "message": "string",
  "result_id": number
}
```

#### Get Result
```
GET /api/exam/{examId}/result

Response:
{
  "score": number,
  "correct_answers": number,
  "total_questions": number,
  "percentage": number,
  "passed": boolean,
  "details": [
    {
      "question_id": number,
      "user_answer": "string",
      "correct_answer": "string",
      "is_correct": boolean
    }
  ]
}
```

### 2. Error Response Format

**Standardized error format:**

```json
{
  "success": false,
  "message": "User-friendly error message",
  "error_code": "ERROR_CODE",
  "errors": {
    "field_name": ["Error message 1", "Error message 2"]
  }
}
```

**HTTP Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized (token invalid/expired)
- 403: Forbidden (no permission)
- 404: Not Found
- 422: Unprocessable Entity (validation error)
- 500: Internal Server Error

### 3. Authentication Flow

**Token Format:**
- Type: JWT (JSON Web Token)
- Format: `Bearer {token}`
- Header: `Authorization: Bearer eyJhbGc...`

**Token Expiry:**
- Expiry time: ? (konfirmasi dengan backend)
- Refresh token: Ada/tidak?
- Auto-refresh: Perlu/tidak?

**Session Management:**
- Max concurrent sessions: ?
- Force logout on new login: ?

### 4. CORS Configuration

**Frontend domain yang perlu di-whitelist:**
```
Development: http://localhost:5173
Staging: https://staging.cbt-platform.com
Production: https://cbt-platform.com
```

**Headers yang dibutuhkan:**
```
Access-Control-Allow-Origin: {frontend-domain}
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

### 5. Rate Limiting

**Yang perlu dikonfirmasi:**
- Rate limit per endpoint: ? requests/minute
- Rate limit per user: ? requests/minute
- Throttling strategy: ?
- Response saat rate limit exceeded: ?

**Recommended:**
```
Login: 5 attempts per 15 minutes
Submit Answer: 100 requests per minute
Get Questions: 10 requests per minute
Submit Exam: 1 request per exam session
```

### 6. Response Time Expectations

**SLA yang diharapkan:**
- Login: < 1 second
- Get Exam: < 1 second
- Get Questions: < 2 seconds
- Submit Answer: < 500ms
- Submit Exam: < 2 seconds
- Get Result: < 1 second

**Timeout settings di frontend:**
- Default: 30 seconds
- Submit Answer: 10 seconds
- Submit Exam: 60 seconds

## 🔒 Security Considerations

### 1. Token Security

**Backend harus implement:**
- Token expiry (recommended: 2 hours untuk exam session)
- Token refresh mechanism (optional)
- Token blacklist untuk logout
- Secure token generation (strong secret key)

### 2. Input Validation

**Backend harus validate:**
- Nomor peserta format
- Password strength
- Question ID exists
- Answer format (A-E only)
- Exam ID exists
- User has access to exam

### 3. Prevent Cheating

**Backend strategies:**
- Randomize question order per user
- Randomize option order per user
- Track answer change frequency
- Track time per question
- IP address logging
- Browser fingerprinting
- Detect multiple tabs/devices
- Prevent back navigation after submit

### 4. Data Integrity

**Backend harus ensure:**
- Atomic transactions untuk submit
- Prevent duplicate submissions
- Validate exam time window
- Lock exam after submission
- Audit trail untuk semua actions

## 📊 Monitoring & Logging

### 1. Backend Logging

**Yang perlu di-log:**
- Login attempts (success/failed)
- Exam start/end
- Answer submissions
- Exam submissions
- API errors
- Suspicious activities

### 2. Metrics

**Yang perlu di-track:**
- API response times
- Error rates
- Active exam sessions
- Concurrent users
- Database query performance

### 3. Alerts

**Setup alerts untuk:**
- High error rate (>5%)
- Slow response time (>3s)
- Failed login attempts (>10 in 5 min)
- Database connection issues
- Server downtime

## 🧪 Testing Coordination

### 1. API Testing

**Yang perlu di-test bersama:**
- Happy path: Complete exam flow
- Error cases: Invalid credentials, expired token
- Edge cases: Concurrent submissions, network issues
- Load testing: 500 concurrent users

### 2. Integration Testing

**Test scenarios:**
1. User login → Get exam → Answer questions → Submit → View result
2. Token expiry during exam
3. Network interruption during save
4. Multiple answer submissions for same question
5. Submit exam with unanswered questions

### 3. Load Testing

**Scenarios:**
- 50 users: Baseline
- 200 users: Normal load
- 500 users: Peak load
- 1000 users: Stress test

## 📞 Communication Channels

### 1. Regular Sync

**Weekly meeting:**
- Progress update
- Blocker discussion
- API changes review
- Bug triage

### 2. Documentation

**Shared docs:**
- API documentation (Swagger/Postman)
- Error codes reference
- Deployment guide
- Troubleshooting guide

### 3. Issue Tracking

**Use shared board:**
- API bugs
- Feature requests
- Performance issues
- Security concerns

## 🚀 Deployment Coordination

### 1. Staging Environment

**Setup:**
- Staging API URL: ?
- Staging database: Separate from production
- Test data: Sample exams & users

### 2. Production Deployment

**Checklist:**
- [ ] API endpoints finalized
- [ ] CORS configured
- [ ] SSL certificate installed
- [ ] Database backup strategy
- [ ] Monitoring setup
- [ ] Error tracking (Sentry)
- [ ] Load balancer configured
- [ ] CDN setup
- [ ] DNS configured

### 3. Rollback Plan

**If deployment fails:**
1. Revert to previous version
2. Notify users
3. Debug issue
4. Fix and redeploy

## 📋 Pre-Production Checklist

### Backend Team

- [ ] API documentation complete
- [ ] All endpoints tested
- [ ] Error handling implemented
- [ ] Validation rules applied
- [ ] CORS configured
- [ ] Rate limiting setup
- [ ] Logging implemented
- [ ] Monitoring setup
- [ ] Database optimized
- [ ] Backup strategy ready
- [ ] SSL certificate installed
- [ ] Load testing done

### Frontend Team

- [ ] API integration complete
- [ ] Error handling tested
- [ ] Loading states implemented
- [ ] Token management working
- [ ] Auto-save tested
- [ ] Timer tested
- [ ] Submit flow tested
- [ ] Mobile responsive
- [ ] Cross-browser tested
- [ ] Performance optimized

### Joint Testing

- [ ] End-to-end flow tested
- [ ] Error scenarios tested
- [ ] Load testing done
- [ ] Security review done
- [ ] UAT completed
- [ ] Documentation updated

## 🐛 Common Issues & Solutions

### Issue 1: CORS Error

**Symptoms:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
- Backend: Add frontend domain to CORS whitelist
- Frontend: Verify API_BASE_URL correct

### Issue 2: Token Expired During Exam

**Symptoms:**
- User gets logged out mid-exam
- 401 Unauthorized error

**Solution:**
- Backend: Increase token expiry for exam sessions
- Frontend: Implement token refresh
- Alternative: Save progress before logout

### Issue 3: Slow Response Time

**Symptoms:**
- API calls take >3 seconds
- Timeout errors

**Solution:**
- Backend: Optimize database queries
- Backend: Add caching layer
- Frontend: Increase timeout for specific endpoints

### Issue 4: Duplicate Submissions

**Symptoms:**
- Same answer submitted multiple times
- Database has duplicate records

**Solution:**
- Backend: Implement idempotency key
- Backend: Use database constraints
- Frontend: Disable button after submit

## 📞 Contact Points

**Backend Team Lead:**
- Name: ?
- Email: ?
- Phone: ?

**DevOps:**
- Name: ?
- Email: ?
- Phone: ?

**Project Manager:**
- Name: ?
- Email: ?
- Phone: ?

## 📅 Timeline

**Phase 1: API Development** (Week 1-2)
- Backend: Implement all endpoints
- Frontend: Setup API client & contexts

**Phase 2: Integration** (Week 3)
- Connect frontend to backend
- Test all flows
- Fix bugs

**Phase 3: Testing** (Week 4)
- Load testing
- Security testing
- UAT

**Phase 4: Deployment** (Week 5)
- Staging deployment
- Final testing
- Production deployment

**Phase 5: Monitoring** (Week 6+)
- Monitor performance
- Fix issues
- Gather feedback
