import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Brain, Globe, LogOut, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { examApi } from '../api/examApi';
import { LoadingSpinner } from './LoadingSpinner';

export default function ExamSelectionPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [examTypes, setExamTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Icon mapping based on exam name
  const getExamIcon = (examName) => {
    const name = examName.toLowerCase();
    if (name.includes('akademik') || name.includes('tpa')) return Brain;
    if (name.includes('inggris') || name.includes('tbi')) return Globe;
    if (name.includes('umum') || name.includes('tpu')) return BookOpen;
    return BookOpen;
  };

  // Color mapping based on exam name
  const getExamColor = (examName) => {
    const name = examName.toLowerCase();
    if (name.includes('akademik') || name.includes('tpa')) return 'from-blue-600 to-blue-800';
    if (name.includes('inggris') || name.includes('tbi')) return 'from-yellow-400 to-yellow-600';
    if (name.includes('umum') || name.includes('tpu')) return 'from-indigo-600 to-indigo-800';
    return 'from-blue-600 to-blue-800';
  };

  // Load ujians from API
  useEffect(() => {
    const loadUjians = async () => {
      setIsLoading(true);
      setError(null);

      // DEMO MODE: Use mock data
      setTimeout(() => {
        const mockExams = [
          {
            id: 1,
            title: 'TPA',
            subtitle: 'Tes Potensi Akademik',
            description: 'Tes kemampuan berpikir logis, analitis, dan pemecahan masalah',
            icon: Brain,
            color: 'from-blue-600 to-blue-800',
            examId: 1,
          },
          {
            id: 2,
            title: 'TBI',
            subtitle: 'Tes Bahasa Inggris',
            description: 'Tes kemampuan bahasa Inggris meliputi reading, listening, dan grammar',
            icon: Globe,
            color: 'from-yellow-400 to-yellow-600',
            examId: 2,
          },
          {
            id: 3,
            title: 'TPU',
            subtitle: 'Tes Pengetahuan Umum',
            description: 'Tes pengetahuan umum tentang berbagai bidang ilmu',
            icon: BookOpen,
            color: 'from-indigo-600 to-indigo-800',
            examId: 3,
          },
        ];
        
        setExamTypes(mockExams);
        setIsLoading(false);
      }, 500);

      /* REAL API INTEGRATION (uncomment when backend ready):
      const result = await examApi.getUjians();
      
      if (result.success) {
        // Map API data to exam cards format
        const mappedExams = result.data.map((ujian) => ({
          id: ujian.id,
          title: ujian.nama.split(' ')[0], // Extract first word (TPA, TBI, TPU)
          subtitle: ujian.nama,
          description: `Ujian ${ujian.nama}`,
          icon: getExamIcon(ujian.nama),
          color: getExamColor(ujian.nama),
          examId: ujian.id,
        }));
        setExamTypes(mappedExams);
      } else {
        setError(result.error);
      }

      setIsLoading(false);
      */
    };

    loadUjians();
  }, []);

  const handleSelectExam = (examId) => {
    navigate(`/exam/${examId}`);
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
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Platform CBT
              </h1>
              <p className="text-sm text-gray-600">Halo, {user?.nama || 'Peserta'} 👋</p>
            </div>
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Demo Mode Active
          </div>
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
            <LoadingSpinner />
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
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {examTypes.map((exam) => {
            const Icon = exam.icon;
            return (
              <div
                key={exam.id}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2"
                onClick={() => handleSelectExam(exam.examId)}
              >
                {/* Card Header with Gradient */}
                <div className={`bg-gradient-to-br ${exam.color} p-8 text-white relative overflow-hidden`}>
                  {/* Decorative circles */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-center mb-4">
                      <div className="bg-white/20 backdrop-blur-sm p-5 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-12 h-12" />
                      </div>
                    </div>
                    <h3 className="text-4xl font-bold text-center mb-2">
                      {exam.title}
                    </h3>
                    <p className="text-center text-white/90 font-medium text-lg">
                      {exam.subtitle}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <p className="text-gray-600 text-center mb-6 leading-relaxed">
                    {exam.description}
                  </p>
                  
                  {/* Stats */}
                  <div className="flex justify-around mb-6 py-4 bg-gray-50 rounded-xl">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-800">
                        {exam.id === 1 ? '15' : exam.id === 2 ? '12' : '20'}
                      </p>
                      <p className="text-xs text-gray-500">Soal</p>
                    </div>
                    <div className="w-px bg-gray-300"></div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-800">
                        {exam.id === 1 ? '90' : exam.id === 2 ? '60' : '75'}
                      </p>
                      <p className="text-xs text-gray-500">Menit</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectExam(exam.examId);
                    }}
                    className={`w-full bg-gradient-to-r ${exam.color} text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 group-hover:scale-105 flex items-center justify-center gap-2`}
                  >
                    <span>Mulai Ujian</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        )}

        {/* Info Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-2xl shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-3 text-lg">Informasi Penting</h4>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 text-sm">Pastikan koneksi internet stabil</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 text-sm">Jawaban tersimpan otomatis di browser</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 text-sm">Tandai soal yang ragu-ragu</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 text-sm">Perhatikan waktu yang tersedia</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 text-sm">Gunakan keyboard untuk navigasi cepat</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 text-sm">Ujian hanya dapat dikerjakan satu kali</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
