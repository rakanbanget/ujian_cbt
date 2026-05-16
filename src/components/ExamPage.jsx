import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExamProvider, useExam } from '../contexts/ExamContext';
import { useAuth } from '../contexts/AuthContext';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { ExamSecurityWrapper } from './ExamSecurityWrapper';
import { LoadingSpinner } from './LoadingSpinner';
import { ConfirmModal } from './ConfirmModal';
import { ReviewPage } from './ReviewPage';
import Timer from './Timer';
import QuestionGrid from './QuestionGrid';
import QuestionDisplay from './QuestionDisplay';
import { LogOut, CheckCircle, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';

function ExamContent() {
  const {
    exam,
    questions,
    currentQuestion,
    currentQuestionIndex,
    answers,
    doubtfulQuestions,
    timeRemaining,
    isLoading,
    error,
    isSaving,
    setAnswer,
    toggleDoubtful,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    handleSubmitExam,
    answeredCount,
    doubtfulCount,
  } = useExam();

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showReview, setShowReview] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Keyboard navigation
  useKeyboardNavigation({
    onNext: nextQuestion,
    onPrevious: previousQuestion,
    onSubmit: () => setShowReview(true),
    enabled: !showReview && !showSubmitConfirm && !showLogoutConfirm,
  });

  const handleSubmit = async (isAutoSubmit = false) => {
    setIsSubmitting(true);
    const result = await handleSubmitExam();
    setIsSubmitting(false);

    if (result.success) {
      if (isAutoSubmit) {
        alert('Ujian telah disubmit otomatis karena pelanggaran keamanan. Hasil akan ditinjau oleh pengawas.');
      } else {
        alert('Ujian berhasil disubmit! Terima kasih.');
      }
      navigate('/login');
    } else {
      alert('Gagal submit ujian: ' + result.error);
    }
  };

  const handleAutoSubmit = () => {
    console.warn('Auto-submitting exam due to security violations');
    handleSubmit(true);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" text="Memuat ujian..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Terjadi Kesalahan</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <ExamSecurityWrapper onAutoSubmit={handleAutoSubmit}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-md px-4 md:px-6 py-3 md:py-4 sticky top-0 z-40">
          <div className="flex justify-between items-center max-w-full overflow-hidden">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                aria-label="Toggle Sidebar"
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="flex items-center gap-4">
                <img src="/logoo.png" alt="Logo" className="w-12 h-12 md:w-16 md:h-16 object-contain" />
                <div>
                  <h1 className="text-sm md:text-xl font-bold text-gray-900 truncate max-w-[120px] md:max-w-none">
                    {exam?.title || 'Ujian'}
                  </h1>
                  <p className="text-[10px] md:text-sm text-gray-600 truncate max-w-[120px] md:max-w-none">
                    {user?.nama}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4">
              <div className="hidden sm:block">
                {isSaving && (
                  <span className="text-xs text-blue-600 flex items-center gap-1">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                    Saving...
                  </span>
                )}
              </div>
              <Timer timeRemaining={timeRemaining} />
              <button
                onClick={() => setShowReview(true)}
                className="bg-secondary text-primary px-3 md:px-6 py-2 rounded-lg hover:bg-secondary-600 transition flex items-center gap-1 md:gap-2 font-bold text-xs md:text-base"
              >
                <CheckCircle className="w-4 h-4 md:w-5 h-5" />
                <span className="hidden xs:inline">Selesai</span>
                <span className="xs:hidden">Finish</span>
              </button>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="p-1 md:p-2 text-gray-600 hover:text-red-600 transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4 md:w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row relative">
          {/* Overlay for mobile sidebar */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside className={`
            fixed lg:sticky top-0 lg:top-[73px] left-0 h-full lg:h-[calc(100vh-73px)]
            w-72 bg-white shadow-xl lg:shadow-md p-6 z-40 transition-transform duration-300 transform
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            <div className="flex justify-between items-center mb-6 lg:hidden">
              <h3 className="font-bold text-gray-900">Navigasi</h3>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-3 text-sm md:text-base">Status Pengerjaan</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-gray-600">Dijawab:</span>
                  <span className="font-semibold text-green-600">{answeredCount}</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-gray-600">Ragu-ragu:</span>
                  <span className="font-semibold text-yellow-600">{doubtfulCount}</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-gray-600">Belum dijawab:</span>
                  <span className="font-semibold text-gray-600">
                    {questions.length - answeredCount}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 max-h-[50vh] lg:max-h-none overflow-y-auto">
              <h3 className="font-bold text-gray-900 mb-3 text-sm md:text-base">Navigasi Soal</h3>
              <QuestionGrid
                questions={questions}
                currentIndex={currentQuestionIndex}
                answers={answers}
                doubtfulQuestions={doubtfulQuestions}
                onSelectQuestion={(idx) => {
                  goToQuestion(idx);
                  setIsSidebarOpen(false);
                }}
              />
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-gray-700 hidden lg:block">
              <p className="font-semibold mb-2 text-xs md:text-sm">💡 Tips:</p>
              <ul className="space-y-1 text-[10px] md:text-xs">
                <li>• Arrow keys: Navigasi</li>
                <li>• Ctrl+Enter: Submit</li>
                <li>• Auto-save aktif</li>
              </ul>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-3 md:p-6 w-full max-w-full overflow-hidden">
            <div className="lg:max-w-4xl mx-auto">
            <QuestionDisplay
              question={currentQuestion}
              selectedAnswer={answers[currentQuestion?.id]}
              onSelectAnswer={(answer) => setAnswer(currentQuestion.id, answer)}
              isDoubtful={doubtfulQuestions.has(currentQuestion?.id)}
              examTitle={exam?.title}
            />

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between mt-8 mb-10">
              <button
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
                className="order-2 sm:order-1 px-4 md:px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <ChevronLeft className="w-5 h-5" />
                Sebelumnya
              </button>

              <button
                onClick={() => toggleDoubtful(currentQuestion.id)}
                className={`order-1 sm:order-2 px-4 md:px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 text-sm md:text-base ${doubtfulQuestions.has(currentQuestion?.id)
                  ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-500'
                  : 'bg-yellow-500 text-white hover:bg-yellow-600'
                  }`}
              >
                {doubtfulQuestions.has(currentQuestion?.id) ? '✓ Dipilih Ragu' : 'Ragu-ragu'}
              </button>

              <button
                onClick={nextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
                className="order-3 px-4 md:px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold flex items-center justify-center gap-2 text-sm md:text-base"
              >
                Selanjutnya
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            </div>
          </main>
        </div>

        {/* Review Modal */}
        {showReview && (
          <ReviewPage
            onClose={() => setShowReview(false)}
            onSubmit={() => {
              setShowReview(false);
              setShowSubmitConfirm(true);
            }}
          />
        )}

        {/* Submit Confirmation */}
        <ConfirmModal
          isOpen={showSubmitConfirm}
          onClose={() => setShowSubmitConfirm(false)}
          onConfirm={handleSubmit}
          title="Konfirmasi Submit Ujian"
          message="Apakah Anda yakin ingin mengakhiri ujian? Jawaban tidak dapat diubah setelah submit."
          confirmText={isSubmitting ? 'Memproses...' : 'Ya, Submit Ujian'}
          cancelText="Batal"
          isDestructive={true}
        />

        {/* Logout Confirmation */}
        <ConfirmModal
          isOpen={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
          onConfirm={handleLogout}
          title="Konfirmasi Logout"
          message="Apakah Anda yakin ingin logout? Progress ujian akan tersimpan."
          confirmText="Ya, Logout"
          cancelText="Batal"
          isDestructive={true}
        />
      </div>
    </ExamSecurityWrapper>
  );
}

export default function ExamPage() {
  const { examId } = useParams();

  return (
    <ExamProvider examId={examId}>
      <ExamContent />
    </ExamProvider>
  );
}
