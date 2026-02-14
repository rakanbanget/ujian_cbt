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
import { LogOut, CheckCircle } from 'lucide-react';

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
        const score = result.data?.score;
        const msg = score !== undefined
          ? `Ujian berhasil disubmit! Skor Anda: ${score}`
          : 'Ujian berhasil disubmit! Terima kasih.';
        alert(msg);
      }
      navigate('/login');
    } else {
      if (result.score !== undefined) {
        alert(`Gagal submit: ${result.error}\nSkor Anda: ${result.score}`);
        navigate('/login');
      } else {
        alert('Gagal submit ujian: ' + result.error);
      }
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
        <header className="bg-white shadow-md px-6 py-4 sticky top-0 z-40">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{exam?.title || 'Ujian'}</h1>
              <p className="text-sm text-gray-600">
                {user?.nama} • Soal {currentQuestionIndex + 1} dari {questions.length}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {isSaving && (
                <span className="text-sm text-blue-600 flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  Menyimpan...
                </span>
              )}
              <Timer timeRemaining={timeRemaining} />
              <button
                onClick={() => setShowReview(true)}
                className="bg-secondary text-primary px-6 py-2 rounded-lg hover:bg-secondary-600 transition flex items-center gap-2 font-bold"
              >
                <CheckCircle className="w-5 h-5" />
                Selesai Ujian
              </button>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="text-gray-600 hover:text-red-600 transition"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside className="w-72 bg-white shadow-md p-6 min-h-[calc(100vh-73px)] sticky top-[73px]">
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-3">Status Pengerjaan</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Dijawab:</span>
                  <span className="font-semibold text-green-600">{answeredCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ragu-ragu:</span>
                  <span className="font-semibold text-yellow-600">{doubtfulCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Belum dijawab:</span>
                  <span className="font-semibold text-gray-600">
                    {questions.length - answeredCount}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-bold text-gray-900 mb-3">Navigasi Soal</h3>
              <QuestionGrid
                questions={questions}
                currentIndex={currentQuestionIndex}
                answers={answers}
                doubtfulQuestions={doubtfulQuestions}
                onSelectQuestion={goToQuestion}
              />
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
              <p className="font-semibold mb-2">💡 Tips:</p>
              <ul className="space-y-1 text-xs">
                <li>• Arrow keys: Navigasi</li>
                <li>• Ctrl+Enter: Submit</li>
                <li>• Auto-save setiap 3 detik</li>
              </ul>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6">
            <QuestionDisplay
              question={currentQuestion}
              selectedAnswer={answers[currentQuestion?.id]}
              onSelectAnswer={(answer) => setAnswer(currentQuestion.id, answer)}
              isDoubtful={doubtfulQuestions.has(currentQuestion?.id)}
            />

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
              >
                ← Sebelumnya
              </button>

              <button
                onClick={() => toggleDoubtful(currentQuestion.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition ${doubtfulQuestions.has(currentQuestion?.id)
                  ? 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  : 'bg-yellow-500 text-white hover:bg-yellow-600'
                  }`}
              >
                {doubtfulQuestions.has(currentQuestion?.id) ? '✓ Ragu-ragu' : 'Ragu-ragu'}
              </button>

              <button
                onClick={nextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
              >
                Selanjutnya →
              </button>
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
