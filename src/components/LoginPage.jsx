import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from './LoadingSpinner';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('=== LOGIN FORM SUBMITTED ===');
    console.log('Email:', email);
    
    setError('');
    setIsLoading(true);

    try {
      // DEMO MODE: Aktif untuk test UI tanpa backend
      // Comment bagian ini jika backend sudah ready
      if (email && password) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        sessionStorage.setItem('cbt_auth_token', 'demo-token-12345');
        sessionStorage.setItem('cbt_user_data', JSON.stringify({
          nama: 'Demo User',
          email: email,
          role: 'pendaftar'
        }));
        setIsLoading(false);
        navigate('/select-exam');
        return;
      }
      
      /* REAL API MODE: Uncomment jika backend sudah ready
      console.log('Calling API login...');
      
      // Import authApi
      const { authApi } = await import('../api/authApi');
      
      // Call real API
      const result = await authApi.login(email, password, 'web_browser');
      
      console.log('API Response:', result);
      
      if (result.success) {
        console.log('Login successful!');
        console.log('User:', result.data.user);
        
        setIsLoading(false);
        navigate('/select-exam');
      } else {
        console.error('Login failed:', result.error);
        setError(result.error || 'Login gagal. Silakan coba lagi.');
        setIsLoading(false);
      }
      */
      
    } catch (err) {
      console.error('Login error:', err);
      setError('Terjadi kesalahan. Silakan coba lagi.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-600 to-primary-800 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/20 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">Platform CBT</h1>
          <p className="text-gray-600">Silakan login untuk memulai ujian</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6">
            <p className="font-semibold">Login Gagal</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

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
              required
              disabled={isLoading}
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
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Pastikan koneksi internet Anda stabil</p>
        </div>
      </div>
    </div>
  );
}
