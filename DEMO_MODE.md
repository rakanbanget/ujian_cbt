# 🎭 Demo Mode - Testing UI Without Backend

## ✅ Status: DEMO MODE ACTIVE

Aplikasi sekarang berjalan dalam **DEMO MODE** untuk testing UI tanpa backend.

## 🔓 Login (Any Credentials)

Masukkan **nomor peserta dan password apa saja**, aplikasi akan langsung login.

Contoh:
- Nomor Peserta: `12345` (atau apa saja)
- Password: `password` (atau apa saja)

## 📝 Mock Data

### Exam Data
- **Judul**: Ujian Tengah Semester - Matematika
- **Durasi**: 60 menit
- **Jumlah Soal**: 10 soal

### Questions
- 10 soal dengan opsi A-E
- Mock text untuk testing UI

## ✨ Fitur yang Bisa Ditest

### ✅ Working Features
- Login (bypass authentication)
- Exam page layout
- Question display
- Answer selection (saved to localStorage)
- Navigation (buttons & keyboard)
- Timer countdown
- Mark as doubtful
- Question grid navigation
- Review page
- Submit exam (mock)
- State recovery (refresh page)

### ⚠️ Mock Features (Not Real API)
- Auto-save (simulated, no real API call)
- Submit exam (simulated success)
- Timer (countdown works, no backend sync)

## 🎯 Testing Checklist

Test semua fitur UI:

- [ ] Login dengan credentials apa saja
- [ ] Lihat exam page
- [ ] Pilih jawaban (A-E)
- [ ] Navigate dengan tombol (Sebelumnya/Selanjutnya)
- [ ] Navigate dengan keyboard (Arrow keys)
- [ ] Mark soal sebagai ragu-ragu
- [ ] Klik nomor soal di sidebar
- [ ] Lihat timer countdown
- [ ] Klik "Selesai Ujian" → Review page
- [ ] Review semua jawaban
- [ ] Submit exam
- [ ] Refresh page → state recovery

## 🔄 Switch to Real API

Ketika backend sudah ready, uncomment code di:

### 1. src/components/LoginPage.jsx
```javascript
// Uncomment section "REAL API INTEGRATION"
// Comment section "TEMPORARY: Mock login"
```

### 2. src/contexts/ExamContext.jsx
```javascript
// Uncomment 3 sections "REAL API INTEGRATION":
// 1. Load exam data
// 2. Auto-save to API
// 3. Submit exam
```

### 3. Update .env
```bash
VITE_API_BASE_URL=http://your-backend-url/api
```

### 4. Restart Server
```bash
npm run dev
```

## 📊 Mock vs Real Comparison

| Feature | Mock Mode | Real API Mode |
|---------|-----------|---------------|
| Login | Any credentials | Real credentials |
| Exam Data | Hardcoded | From backend |
| Questions | Mock 10 questions | From backend |
| Auto-save | Simulated | Real POST to API |
| Submit | Simulated success | Real POST to API |
| Timer | Local countdown | Synced with backend |
| State | localStorage only | localStorage + backend |

## 💡 Tips

1. **Test UI/UX** - Gunakan mock mode untuk test semua UI
2. **Test Flow** - Test complete flow dari login sampai submit
3. **Test Responsive** - Test di mobile & desktop
4. **Test Keyboard** - Test keyboard shortcuts
5. **Test Recovery** - Refresh page, check state recovery

## 🐛 Known Limitations (Mock Mode)

- ❌ No real authentication
- ❌ No real data from backend
- ❌ No real auto-save to server
- ❌ No real submit to server
- ❌ No timer sync with backend
- ❌ No validation from backend

## ✅ What Works (Mock Mode)

- ✅ Complete UI/UX
- ✅ All interactions
- ✅ State management
- ✅ localStorage persistence
- ✅ Timer countdown
- ✅ Navigation
- ✅ Keyboard shortcuts
- ✅ Review page
- ✅ Confirmation modals

## 🚀 Ready for Production

Ketika switch ke real API:
1. Uncomment real API code
2. Update .env
3. Test dengan backend
4. Deploy

---

**Current Mode: 🎭 DEMO MODE**

**To Switch: Uncomment "REAL API INTEGRATION" sections**
