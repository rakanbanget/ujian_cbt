import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Brain, Globe, LogOut } from 'lucide-react';

export default function ExamSelectionPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const examTypes = [
    {
      id: 'tpa',
      title: 'TPA',
      subtitle: 'Tes Potensi Akademik',
      description: 'Tes kemampuan berpikir logis, analitis, dan pemecahan masalah',
      icon: Brain,
      color: 'from-primary to-primary-700',
      examId: 1,
    },
    {
      id: 'tbi',
      title: 'TBI',
      subtitle: 'Tes Bahasa Inggris',
      description: 'Tes kemampuan bahasa Inggris meliputi reading, listening, dan grammar',
      icon: Globe,
      color: 'from-secondary to-secondary-600',
      examId: 2,
    },
    {
      id: 'tpu',
      title: 'TPU',
      subtitle: 'Tes Pengetahuan Umum',
      description: 'Tes pengetahuan umum tentang berbagai bidang ilmu',
      icon: BookOpen,
      color: 'from-primary-600 to-primary-800',
      examId: 3,
    },
  ];

  const handleSelectExam = (examId) => {
    navigate(`/exam/${examId}`);
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
          <div>
            <h1 className="text-2xl font-bold text-primary">Platform CBT</h1>
            <p className="text-sm text-gray-600">Selamat datang, {user?.nama}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {examTypes.map((exam) => {
            const Icon = exam.icon;
            return (
              <div
                key={exam.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
                onClick={() => handleSelectExam(exam.examId)}
              >
                {/* Card Header with Gradient */}
                <div className={`bg-gradient-to-br ${exam.color} p-8 text-white`}>
                  <div className="flex justify-center mb-4">
                    <div className="bg-white bg-opacity-20 p-4 rounded-full">
                      <Icon className="w-12 h-12" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-center mb-2">
                    {exam.title}
                  </h3>
                  <p className="text-center text-white text-opacity-90 font-medium">
                    {exam.subtitle}
                  </p>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <p className="text-gray-600 text-center mb-6">
                    {exam.description}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectExam(exam.examId);
                    }}
                    className={`w-full bg-gradient-to-r ${exam.color} text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 group-hover:scale-105`}
                  >
                    Mulai Ujian
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
