import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';
import { LogIn } from 'lucide-react';
import Swal from 'sweetalert2';
import ReCAPTCHA from 'react-google-recaptcha';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate Captcha
    if (!captchaToken) {
      Swal.fire({
        icon: 'warning',
        title: 'Captcha Required',
        text: 'Silakan centang reCAPTCHA untuk melanjutkan.',
        confirmButtonColor: '#10b981',
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Login Berhasil',
          text: 'Selamat datang kembali!',
          timer: 1500,
          showConfirmButton: false,
          position: 'top-end',
          toast: true
        });
        setIsLoading(false);
        navigate('/select-exam');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Gagal',
          text: result.error || 'Email atau password mungkin salah.',
          confirmButtonColor: '#10b981',
        });
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Kesalahan Sistem',
        text: 'Terjadi kesalahan. Silakan coba lagi.',
        confirmButtonColor: '#10b981',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-600 to-primary-800 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src="/logo_mfls.jpeg" alt="MFLS Logo" className="w-24 h-24 object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">Platform Pengerjaan MFLS</h1>
          <p className="text-gray-600">Silakan login untuk memulai pengerjaan</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              placeholder="Masukkan email"
              required
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              placeholder="Masukkan password"
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-center my-4 overflow-hidden rounded-lg">
            <ReCAPTCHA
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={handleCaptchaChange}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Masuk</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Platform CBT MFLS. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
