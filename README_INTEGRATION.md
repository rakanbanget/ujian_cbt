# CBT Platform - Backend Integration Complete 🎉

## Overview
This is a complete Computer-Based Test (CBT) platform with full backend API integration. The frontend is built with React + Vite + Tailwind CSS and integrates with a Laravel backend using Sanctum authentication.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Laravel backend running at `http://127.0.0.1:8000`
- Database with test data

### Installation
```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL

# Start development server
npm run dev
```

### First Run
1. Ensure backend is running at `http://127.0.0.1:8000`
2. Open browser to `http://localhost:5173`
3. Login with valid credentials
4. Select an exam and start testing

## 📚 Documentation

### Essential Reading
1. **[BACKEND_ROUTES_VERIFIED.md](BACKEND_ROUTES_VERIFIED.md)** - Confirms all routes match backend
2. **[BACKEND_INTEGRATION_COMPLETE.md](BACKEND_INTEGRATION_COMPLETE.md)** - Complete integration guide
3. **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Step-by-step testing instructions
4. **[QUICK_API_REFERENCE.md](QUICK_API_REFERENCE.md)** - Quick reference card

### Additional Documentation
- **[API_INTEGRATION_STATUS.md](API_INTEGRATION_STATUS.md)** - Integration status report
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Production deployment guide
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture
- **[SECURITY_FEATURES.md](SECURITY_FEATURES.md)** - Anti-cheating features
- **[AUTO_SUBMIT_SYSTEM.md](AUTO_SUBMIT_SYSTEM.md)** - Violation handling

## ✅ What's Integrated

### Authentication
- ✅ Email-based login with Laravel Sanctum
- ✅ Token storage and management
- ✅ Automatic token attachment to requests
- ✅ 401 error handling (auto-logout)

### Exam Management
- ✅ Dynamic exam list from API
- ✅ Question loading from API
- ✅ Answer submission to API
- ✅ Results display (score, correct answers)
- ✅ "Already submitted" detection

### Security Features
- ✅ Fullscreen mode enforcement
- ✅ Tab switch detection
- ✅ DevTools blocking
- ✅ Copy/paste prevention
- ✅ 3-strike violation system
- ✅ Auto-submit on violations
- ✅ Timer-based auto-submit

### User Experience
- ✅ Loading states
- ✅ Error handling
- ✅ LocalStorage auto-save
- ✅ State recovery on refresh
- ✅ Keyboard navigation
- ✅ Question grid navigation
- ✅ Doubtful question marking

## 🔌 API Endpoints

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/login` | POST | User authentication | ✅ |
| `/api/ujians` | GET | List exams | ✅ |
| `/api/soal` | GET | Get questions | ✅ |
| `/api/soal/submit` | POST | Submit answers | ✅ |

## 🗂️ Project Structure

```
src/
├── api/                    # API integration
│   ├── apiClient.js       # Axios instance + interceptors
│   ├── authApi.js         # Authentication endpoints
│   └── examApi.js         # Exam endpoints
├── components/            # React components
│   ├── LoginPage.jsx      # Login with API
│   ├── ExamSelectionPage.jsx  # Load exams from API
│   ├── ExamPage.jsx       # Main exam interface
│   ├── ExamSecurityWrapper.jsx  # Security features
│   └── ...
├── contexts/              # React contexts
│   ├── AuthContext.jsx    # Auth state management
│   └── ExamContext.jsx    # Exam state + API calls
├── hooks/                 # Custom hooks
│   ├── useExamSecurity.js # Security monitoring
│   └── ...
├── constants/             # Configuration
│   └── apiEndpoints.js    # API endpoint definitions
└── utils/                 # Utilities
    └── storage.js         # LocalStorage helpers
```

## 🧪 Testing

### Manual Testing
```bash
# 1. Start backend
cd /path/to/backend
php artisan serve

# 2. Start frontend
npm run dev

# 3. Test flow
# - Login with valid credentials
# - Select an exam
# - Answer questions
# - Submit and view results
```

### API Testing with Postman
See [TESTING_GUIDE.md](TESTING_GUIDE.md) for detailed Postman examples.

## 🔧 Configuration

### Environment Variables
```env
# .env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_ENV=development
```

### Backend CORS
```php
// config/cors.php
'allowed_origins' => ['http://localhost:5173'],
```

## 🎨 Features

### For Students
- Clean, intuitive interface
- Real-time timer
- Question navigation grid
- Mark questions as doubtful
- Review before submit
- Keyboard shortcuts
- Auto-save to browser

### For Administrators
- Secure exam environment
- Anti-cheating measures
- Violation tracking
- Auto-submit on violations
- Prevent duplicate submissions
- Detailed results

## 🔒 Security

### Anti-Cheating Features
- Fullscreen enforcement
- Tab switch detection (3 violations = auto-submit)
- DevTools blocking (F12, Ctrl+Shift+I, etc.)
- Right-click disabled
- Copy/paste disabled
- Print disabled
- Screenshot prevention (best effort)

### Authentication Security
- Laravel Sanctum token-based auth
- Secure token storage
- Automatic token expiration handling
- HTTPS recommended for production

## 📊 Data Flow

### Login Flow
```
User → LoginPage → authApi.login() → Backend
Backend → Token + User Data → AuthContext → localStorage
AuthContext → Navigate to ExamSelection
```

### Exam Flow
```
User → ExamSelection → examApi.getUjians() → Backend
Backend → Exam List → Display Cards
User Clicks Exam → ExamPage → examApi.getSoal() → Backend
Backend → Questions → ExamContext → Display
User Answers → Save to localStorage
User Submits → examApi.submitJawaban() → Backend
Backend → Results → Display → Navigate to ExamSelection
```

## 🐛 Troubleshooting

### Common Issues

**Network Error on Login**
- Check backend is running: `curl http://127.0.0.1:8000/api/login`
- Verify CORS configuration
- Check browser console for details

**401 Unauthorized**
- Clear localStorage: `localStorage.clear()`
- Login again
- Check token format in localStorage

**Questions Not Loading**
- Verify ujian_id is valid
- Check database has soal records
- Test endpoint with Postman

**Already Submitted Error**
- Expected behavior if user already took exam
- Shows previous score
- Cannot retake exam

See [TESTING_GUIDE.md](TESTING_GUIDE.md) for more troubleshooting.

## 📦 Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
# Output in dist/ folder
```

### Deploy
See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for complete deployment guide.

## 🎯 Browser Support

- Chrome/Edge (latest) ✅
- Firefox (latest) ✅
- Safari (latest) ✅
- Mobile browsers (limited security features)

## 📝 Notes

### Auto-Save Behavior
- Answers save to **localStorage only**
- Backend does NOT support incremental saves
- Only final submission sent to API
- LocalStorage cleared after successful submit

### Answer Format
- Frontend uses uppercase (A, B, C, D)
- Backend expects lowercase (a, b, c, d)
- Automatic conversion on submit

### Exam Duration
- Currently hardcoded to 90 minutes
- Can be updated if backend provides duration field

## 🤝 Contributing

### Code Style
- Use ESLint configuration
- Follow React best practices
- Write meaningful commit messages
- Update documentation

### Testing
- Test all changes manually
- Check browser console for errors
- Verify API integration
- Test security features

## 📞 Support

### For Issues
1. Check documentation first
2. Review browser console
3. Test API with Postman
4. Check backend logs
5. Contact development team

### Documentation
- Frontend: This repository
- Backend: Contact backend team
- API: See [BACKEND_INTEGRATION_COMPLETE.md](BACKEND_INTEGRATION_COMPLETE.md)

## 📄 License

[Your License Here]

## 👥 Team

- Frontend Development: [Your Name]
- Backend Development: [Backend Team]
- UI/UX Design: [Designer Name]
- Project Management: [PM Name]

## 🎉 Status

**✅ READY FOR INTEGRATION TESTING**

All API endpoints are integrated, tested, and documented. The platform is ready for testing with the real backend.

---

**Version**: 1.0.0  
**Last Updated**: February 11, 2026  
**Integration Status**: Complete ✅
