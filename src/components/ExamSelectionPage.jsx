import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Brain, Globe, LogOut, CheckCircle, AlertTriangle } from 'lucide-react';
import { examApi } from '../api/examApi';
import Swal from 'sweetalert2';

export default function ExamSelectionPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [availableExams, setAvailableExams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Metadata style helper
  const getExamStyle = (name) => {
    const title = name.toLowerCase();

    if (title.includes('akademik') || title.includes('tpa') || title.includes('tba')) {
      return {
        subtitle: title.includes('tba') ? 'Tes Bakat Akademik' : 'Tes Potensi Akademik',
        description: 'Tes kemampuan berpikir logis, analitis, dan pemecahan masalah',
        icon: Brain,
        color: 'from-primary to-primary-700',
      };
    } else if (title.includes('psikotes') || title.includes('psikologi')) {
      return {
        subtitle: 'Tes Psikotes',
        description: 'Tes kepribadian dan potensi kerja',
        icon: Brain,
        color: 'from-purple-600 to-purple-800',
      };
    } else if (title.includes('inggris') || title.includes('tbi')) {
      return {
        subtitle: 'Tes Bahasa Inggris',
        description: 'Tes kemampuan bahasa Inggris meliputi reading, listening, dan grammar',
        icon: Globe,
        color: 'from-secondary to-secondary-600',
      };
    } else if (title.includes('umum') || title.includes('tpu') || title.includes('ujian')) {
      return {
        subtitle: 'Ujian Kompetensi',
        description: 'Tes pengetahuan umum tentang berbagai bidang ilmu',
        icon: BookOpen,
        color: 'from-primary-600 to-primary-800',
      };
    } else {
      return {
        subtitle: 'Ujian Standar',
        description: 'Silakan kerjakan ujian ini dengan teliti.',
        icon: BookOpen,
        color: 'from-gray-600 to-gray-800',
      };
    }
  };

  useEffect(() => {
    const fetchExams = async () => {
      setIsLoading(true);
      try {
        const result = await examApi.getUjians();
        if (result.success && Array.isArray(result.data)) {
          const mappedExams = result.data.map((exam) => {
            const style = getExamStyle(exam.nama || '');

            return {
              ...style,
              examId: exam.id,
              title: exam.nama,
              is_submitted: exam.is_submitted,
              jumlah_soal: exam.jumlah_soal,
            };
          });

          setAvailableExams(mappedExams);
        } else {
          setAvailableExams([]);
        }
      } catch (error) {
        console.error('Failed to fetch exams:', error);
        setAvailableExams([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExams();
  }, []);

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
    const questionCount = Number(exam.jumlah_soal || 0);

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
    navigate(`/exam/${exam.examId}`);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src="/logo_mfls.jpeg" alt="MFLS Logo" className="w-12 h-12 object-contain" />
            <div>
              <h1 className="text-2xl font-bold text-primary">Platform Pengerjaan MFLS</h1>
              <p className="text-sm text-gray-600">Selamat datang, {user?.nama}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">
            Pilih Jenis Ujian
          </h2>
          <p className="text-lg text-gray-600">
            Silakan pilih jenis ujian yang ingin Anda kerjakan
          </p>
        </div>

        {/* Exam Cards */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">Memuat daftar ujian...</p>
          </div>
        ) : availableExams.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
            <div className="text-gray-400 text-5xl mb-4">📭</div>
            <p className="text-gray-600 text-lg font-medium">Tidak ada ujian yang tersedia saat ini.</p>
            <p className="text-gray-400 mb-6">Silakan hubungi administrator jika ini adalah kesalahan.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition font-semibold"
            >
              Refresh Halaman
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {availableExams.map((exam) => {
              const Icon = exam.icon;

              // Pengecekan status pengerjaan
              const isSubmitted = exam.is_submitted === true || exam.is_submitted === 1;

              // Pengecekan jumlah soal
              const questionCount = Number(exam.jumlah_soal || 0);
              const hasNoQuestions = questionCount === 0;

              const isDisabled = isSubmitted || hasNoQuestions;

              return (
                <div
                  key={exam.examId}
                  className={`bg-white rounded-2xl shadow-lg transition-all duration-300 overflow-hidden group flex flex-col ${isDisabled ? 'opacity-80' : 'hover:shadow-2xl cursor-pointer hover:-translate-y-1'
                    }`}
                  onClick={() => handleSelectExam(exam)}
                >
                  {/* Card Header with Gradient */}
                  <div className={`bg-gradient-to-br ${exam.color} p-8 text-white relative`}>
                    {isSubmitted && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        SUDAH MENGERJAKAN
                      </div>
                    )}
                    {hasNoQuestions && !isSubmitted && (
                      <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                        <AlertTriangle className="w-3 h-3" />
                        KOSONG
                      </div>
                    )}
                    <div className="flex justify-center mb-4">
                      <div className="bg-white bg-opacity-20 p-4 rounded-full">
                        <Icon className="w-12 h-12" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-center mb-2 leading-tight">
                      {exam.title}
                    </h3>
                    <p className="text-center text-white text-opacity-90 text-sm font-medium">
                      {exam.subtitle}
                    </p>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="text-center mb-6 flex-1">
                      <p className="text-gray-600">
                        {isSubmitted
                          ? 'Anda telah menyelesaikan ujian ini. Terima kasih atas partisipasi Anda.'
                          : hasNoQuestions
                            ? 'Materi soal untuk pilihan ujian ini sedang dalam proses update.'
                            : exam.description}
                      </p>
                      {!isSubmitted && !hasNoQuestions && (
                        <div className="mt-4 flex justify-center gap-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">
                          <span>{questionCount} Soal</span>
                          <span>•</span>
                          <span>60 Menit</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectExam(exam);
                      }}
                      className={`w-full py-3 rounded-xl font-bold transition-all duration-300 ${isSubmitted
                        ? 'bg-gray-100 text-gray-400 cursor-default border border-gray-200'
                        : hasNoQuestions
                          ? 'bg-gray-50 text-gray-400 cursor-default border border-gray-200'
                          : `bg-gradient-to-r ${exam.color} text-white shadow-md hover:shadow-xl active:scale-95`
                        }`}
                    >
                      {isSubmitted ? 'Sudah Mengerjakan' : hasNoQuestions ? 'Belum Tersedia' : 'Mulai Sekarang'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 bg-white border border-gray-200 p-8 rounded-2xl shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-xl text-primary">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-3">Petunjuk Pengerjaan</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 text-gray-600">
                <li className="flex items-center gap-2">• Pastikan koneksi internet Anda stabil</li>
                <li className="flex items-center gap-2">• Jawaban akan tersimpan otomatis</li>
                <li className="flex items-center gap-2">• Patuhi batas waktu yang tersedia</li>
                <li className="flex items-center gap-2">• Gunakan navigasi soal di dalam ujian</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
