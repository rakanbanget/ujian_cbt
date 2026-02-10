# Quick Start Guide

## 🚀 Setup dalam 5 Menit

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment

```bash
# Copy file environment
cp .env.example .env

# Edit .env dan sesuaikan API URL
# VITE_API_BASE_URL=http://localhost:8000/api
```

### 3. Run Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

## 📝 Cara Menggunakan

### Login

1. Buka `http://localhost:5173/login`
2. Masukkan nomor peserta dan password
3. Klik "Masuk"

### Mengerjakan Ujian

1. Setelah login, akan redirect ke halaman ujian
2. Baca soal dan pilih jawaban (A-E)
3. Klik "Selanjutnya" untuk soal berikutnya
4. Klik nomor soal di sidebar untuk navigasi langsung
5. Klik "Ragu-ragu" untuk menandai soal yang ragu
6. Jawaban otomatis tersimpan setiap 3 detik

### Keyboard Shortcuts

- `Arrow Right` atau `n`: Soal selanjutnya
- `Arrow Left` atau `p`: Soal sebelumnya
- `Ctrl + Enter`: Submit ujian

### Submit Ujian

1. Klik "Selesai Ujian" di header
2. Review jawaban di halaman review
3. Klik "Submit Ujian"
4. Konfirmasi submit
5. Lihat hasil ujian

## 🔧 Integrasi dengan Backend

### Update API Endpoints

Edit `src/constants/apiEndpoints.js`:

```javascript
export const API_BASE_URL = 'http://your-backend-url/api';
```

### Test API Connection

```javascript
// Di browser console
fetch('http://your-backend-url/api/exam/1')
  .then(r => r.json())
  .then(console.log)
```

### Expected API Responses

Lihat `BACKEND_COORDINATION.md` untuk detail lengkap format request/response.

## 🎨 Customization

### Ubah Warna Theme

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
    }
  }
}
```

### Ubah Durasi Timer

Timer duration dari API response (`exam.duration` dalam menit).

### Ubah Jumlah Soal per Grid

Edit `src/components/QuestionGrid.jsx`:

```javascript
// Ubah grid-cols-8 sesuai kebutuhan
<div className="grid grid-cols-8 gap-2">
```

## 🐛 Troubleshooting

### CORS Error

**Problem:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
Backend harus enable CORS untuk frontend domain.

### Token Expired

**Problem:**
User logout otomatis saat ujian.

**Solution:**
Backend perlu increase token expiry time untuk exam session.

### Network Error

**Problem:**
"Koneksi internet bermasalah"

**Solution:**
1. Check internet connection
2. Verify API URL di .env
3. Check backend server running

### Build Error

**Problem:**
Build gagal dengan error.

**Solution:**
```bash
# Clear cache
rm -rf node_modules
rm package-lock.json

# Reinstall
npm install

# Try build again
npm run build
```

## 📚 Next Steps

1. **Baca ARCHITECTURE.md** - Untuk memahami struktur & best practices
2. **Baca BACKEND_COORDINATION.md** - Untuk koordinasi dengan backend team
3. **Test semua fitur** - Login, answer, submit, dll
4. **Customize UI** - Sesuaikan dengan brand/design system
5. **Add features** - Lihat recommendations di ARCHITECTURE.md

## 💡 Tips

- Gunakan React DevTools untuk debugging
- Check Network tab di browser untuk monitor API calls
- Gunakan Console untuk lihat errors
- Test di berbagai browser (Chrome, Firefox, Safari)
- Test di mobile devices

## 📞 Need Help?

- Check dokumentasi di folder root
- Review code comments
- Ask backend team untuk API issues
- Check browser console untuk errors
