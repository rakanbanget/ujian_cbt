# 🔐 Login Integration Guide - MFLS Backend

## ✅ Status: READY FOR REAL API

Login page sudah diupdate untuk connect ke backend API MFLS.

---

## 🔧 Setup Backend

### 1. Pastikan Backend Running

```bash
# Di folder backend Laravel
php artisan serve
```

Backend harus running di: `http://api-mfls.test`

### 2. Update .env Frontend

File: `.env`

```bash
VITE_API_BASE_URL=http://api-mfls.test/api
```

**Sesuaikan dengan URL backend:**
- Local: `http://api-mfls.test/api`
- Local alternative: `http://localhost:8000/api`
- Staging: `https://staging-api.mfls.com/api`
- Production: `https://api.mfls.com/api`

### 3. Enable CORS di Backend

File: `config/cors.php` (Laravel)

```php
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://localhost:5173',  // Vite dev server
        'http://127.0.0.1:5173',
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

---

## 📡 API Endpoint

### Login Request

**URL:** `POST /api/login`

**Headers:**
```
Content-Type: application/json
Accept: application/json
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "device_name": "web_browser"
}
```

### Success Response (200 OK)

```json
{
  "status": "success",
  "token": "1|ABC123XYZ...",
  "user": {
    "nama": "John Doe",
    "email": "user@example.com",
    "role": "pendaftar"
  }
}
```

### Error Response (401 Unauthorized)

```json
{
  "message": "The provided credentials are incorrect."
}
```

---

## 🔄 Login Flow

```
1. User input email & password
   ↓
2. Click "Masuk" button
   ↓
3. Frontend call authApi.login()
   ↓
4. POST /api/login
   ↓
5. Backend validate credentials
   ↓
6. Backend return token & user data
   ↓
7. Frontend save to sessionStorage:
   - cbt_auth_token
   - cbt_user_data
   ↓
8. Navigate to /select-exam
```

---

## 🧪 Testing Steps

### Step 1: Check Backend Running

```bash
curl http://api-mfls.test/api/login
```

Should return method not allowed (karena perlu POST).

### Step 2: Test Login API

```bash
curl -X POST http://api-mfls.test/api/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password",
    "device_name": "curl_test"
  }'
```

Should return token & user data.

### Step 3: Test dari Frontend

1. **Buka browser console** (F12 → Console)
2. **Refresh page** (F5)
3. **Input email & password**
4. **Click "Masuk"**
5. **Check console logs:**

```
=== LOGIN ATTEMPT ===
Email: test@example.com
API URL: http://api-mfls.test/api
API Response: { success: true, data: {...} }
✅ Login successful!
User: { nama: "...", email: "...", role: "..." }
Token: 1|ABC123...
```

---

## 🐛 Troubleshooting

### Issue 1: CORS Error

**Error:**
```
Access to XMLHttpRequest at 'http://api-mfls.test/api/login' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solution:**
1. Check `config/cors.php` di backend
2. Pastikan `http://localhost:5173` ada di `allowed_origins`
3. Restart Laravel server: `php artisan serve`

### Issue 2: Network Error

**Error:**
```
❌ Login error: Network Error
Terjadi kesalahan koneksi. Pastikan backend sudah running.
```

**Solution:**
1. Check backend running: `php artisan serve`
2. Check URL di `.env`: `VITE_API_BASE_URL`
3. Test dengan curl (lihat Step 2)

### Issue 3: 401 Unauthorized

**Error:**
```
❌ Login failed: The provided credentials are incorrect.
```

**Solution:**
1. Check email & password di database
2. Pastikan user ada di table `users`
3. Pastikan password di-hash dengan bcrypt

### Issue 4: 500 Internal Server Error

**Error:**
```
❌ Login failed: Server error
```

**Solution:**
1. Check Laravel logs: `storage/logs/laravel.log`
2. Check database connection
3. Check `.env` backend

---

## 📝 Code Explanation

### Frontend: LoginPage.jsx

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    // Call API
    const result = await authApi.login(email, password, 'web_browser');
    
    if (result.success) {
      // Success: Navigate to exam selection
      navigate('/select-exam');
    } else {
      // Error: Show error message
      setError(result.error);
    }
  } catch (err) {
    setError('Terjadi kesalahan koneksi.');
  } finally {
    setIsLoading(false);
  }
};
```

### Frontend: authApi.js

```javascript
export const authApi = {
  login: async (email, password, deviceName = 'web_browser') => {
    try {
      const response = await apiClient.post('/login', {
        email,
        password,
        device_name: deviceName,
      });

      const { token, user } = response.data;

      // Save to sessionStorage
      tokenStorage.set(token);
      userStorage.set(user);

      return { success: true, data: { token, user } };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  },
};
```

### Backend: LoginController.php (Reference)

```php
public function login(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
        'device_name' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json([
            'message' => 'The provided credentials are incorrect.'
        ], 401);
    }

    $token = $user->createToken($request->device_name)->plainTextToken;

    return response()->json([
        'status' => 'success',
        'token' => $token,
        'user' => [
            'nama' => $user->nama,
            'email' => $user->email,
            'role' => $user->role,
        ]
    ]);
}
```

---

## ✅ Checklist

### Backend Setup
- [ ] Laravel backend running
- [ ] Database connected
- [ ] User exists in database
- [ ] CORS configured
- [ ] Login endpoint working (test with curl)

### Frontend Setup
- [ ] `.env` updated with backend URL
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server running (`npm run dev`)
- [ ] Browser console open for debugging

### Testing
- [ ] Test login with valid credentials
- [ ] Test login with invalid credentials
- [ ] Check token saved to sessionStorage
- [ ] Check navigation to /select-exam
- [ ] Check error messages display correctly

---

## 🎯 Expected Behavior

### Success Case:
1. User input valid email & password
2. Click "Masuk"
3. Loading spinner shows
4. API call successful
5. Token & user saved to sessionStorage
6. Navigate to exam selection page
7. No error message

### Error Case (Invalid Credentials):
1. User input invalid email/password
2. Click "Masuk"
3. Loading spinner shows
4. API returns 401
5. Error message: "The provided credentials are incorrect."
6. Stay on login page
7. User can try again

### Error Case (Network Error):
1. Backend not running
2. Click "Masuk"
3. Loading spinner shows
4. Network error
5. Error message: "Terjadi kesalahan koneksi. Pastikan backend sudah running."
6. Stay on login page

---

## 📊 Debug Checklist

If login not working, check:

1. **Backend running?**
   ```bash
   curl http://api-mfls.test/api/login
   ```

2. **CORS configured?**
   - Check browser console for CORS error
   - Check `config/cors.php`

3. **Credentials correct?**
   - Check database: `SELECT * FROM users WHERE email = 'test@example.com'`
   - Password hashed with bcrypt?

4. **Frontend .env correct?**
   ```bash
   cat .env
   # Should show: VITE_API_BASE_URL=http://api-mfls.test/api
   ```

5. **Token saved?**
   - Open browser console
   - Type: `sessionStorage.getItem('cbt_auth_token')`
   - Should return token string

---

## 🚀 Next Steps

After login working:

1. **Test logout** functionality
2. **Integrate exam selection** page
3. **Load ujians** from API
4. **Test protected routes**
5. **Handle token expiry**

---

**Status: ✅ READY FOR TESTING**

**Next Action: Test login dengan real backend API**
