import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Brain, Globe, LogOut, AlertCircle } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';
import { examApi } from '../api/examApi';
import Swal from 'sweetalert2';

export default function ExamSelectionPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ujians, setUjians] = useState([]);

  useEffect(() => {
    const fetchUjians = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await examApi.getUjians();
        if (result.success) {
          setUjians(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Gagal mengambil daftar ujian. Silakan coba lagi.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUjians();
  }, []);

  // Map API data to display-friendly format
  const getDisplayData = (exam) => {
    // Determine icon and color based on title or ID
    const examTitle = exam.nama || exam.title || '';
    const titleLower = examTitle.toLowerCase();
    
    if (titleLower.includes('tpa')) {
      return { icon: Brain, color: 'from-primary to-primary-700' };
    } else if (titleLower.includes('bahasa')) {
      return { icon: Globe, color: 'from-secondary to-secondary-600' };
    } else {
      return { icon: BookOpen, color: 'from-primary-600 to-primary-800' };
    }
  };

  const handleSelectExam = (exam) => {
    // Pengecekan status pengerjaan
    const isSubmitted = exam.is_submitted === true || exam.is_submitted === 1;

    if (isSubmitted) {
      Swal.fire({
        icon: 'info',
        title: 'Sudah Mengerjakan',
        text: 'Anda sudah menyelesaikan sesi ujian ini. Akses masuk kembali telah ditutup.',
        confirmButtonColor: '#10b981',
      });
      return;
    }

    // Cek apakah ujian memiliki soal
    const questionCount = Number(exam.jumlah_soal || exam.questions_count || 0);

    if (questionCount === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Materi Kosong',
        text: 'Saat ini belum ada soal yang tersedia untuk jenis ujian ini.',
        confirmButtonColor: '#ef4444',
      });
      return;
    }

    // Jika aman, navigasi ke ujian
    navigate(`/exam/${exam.id}`);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Platform CBT</h1>
            <p className="text-sm text-gray-600">Selamat datang, {user?.nama}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Pilih Jenis Ujian
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Silakan pilih jenis ujian yang ingin Anda kerjakan. Pastikan Anda siap sebelum memulai.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner text="Memuat daftar ujian..." />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 animate-shake">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Gagal Memuat Ujian</h3>
                <p className="text-red-700 text-sm">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 text-sm text-red-600 hover:text-red-800 underline font-medium"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Exam Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ujians.map((exam) => {
            const { icon: Icon, color } = getDisplayData(exam);
            return (
              <div
                key={exam.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
                onClick={() => handleSelectExam(exam)}
              >
                {/* Card Header with Gradient */}
                <div className={`bg-gradient-to-br ${color} p-8 text-white relative`}>
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    {exam.is_submitted === true || exam.is_submitted === 1 ? (
                      <span className="bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                        SUDAH DIKERJAKAN
                      </span>
                    ) : Number(exam.jumlah_soal || exam.questions_count || 0) === 0 ? (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                        SOAL BELUM ADA
                      </span>
                    ) : (
                      <span className="bg-white text-primary text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                        SIAP DIKERJAKAN
                      </span>
                    )}
                  </div>

                  <div className="flex justify-center mb-4">
                    <div className="bg-white bg-opacity-20 p-4 rounded-full">
                      <Icon className="w-12 h-12" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-center mb-2">
                    {exam.nama || exam.title || 'Sesi Ujian'}
                  </h3>
                  <p className="text-center text-white text-opacity-90 font-medium">
                    {exam.subtitle || exam.code || exam.kode_ujian || 'Platform CBT'}
                  </p>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <p className="text-gray-600 text-center mb-6 line-clamp-2">
                    {exam.description || exam.keterangan || `Sesi ujian ${exam.nama || exam.title} dengan durasi ${exam.waktu || exam.durasi || exam.duration || 60} menit.`}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectExam(exam);
                    }}
                    disabled={Number(exam.jumlah_soal || exam.questions_count) === 0}
                    className={`w-full bg-gradient-to-r ${color} text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 group-hover:scale-105 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed disabled:scale-100`}
                  >
                    {Number(exam.jumlah_soal || exam.questions_count) === 0 ? 'Materi Kosong' : 'Mulai Ujian'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-secondary/10 border-l-4 border-secondary p-6 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="text-secondary text-2xl">ℹ️</div>
            <div>
              <h4 className="font-bold text-primary mb-2">Informasi Penting:</h4>
              <ul className="space-y-1 text-gray-700 text-sm">
                <li>• Pastikan koneksi internet Anda stabil</li>
                <li>• Jawaban akan tersimpan otomatis setiap 3 detik</li>
                <li>• Anda dapat menandai soal yang ragu-ragu</li>
                <li>• Perhatikan waktu yang tersedia untuk setiap ujian</li>
                <li>• Gunakan keyboard shortcuts untuk navigasi lebih cepat</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
