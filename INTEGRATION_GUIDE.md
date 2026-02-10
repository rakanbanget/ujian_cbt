# Integration Guide - Menghubungkan dengan Existing Components

## 🔄 Step-by-Step Integration

### Step 1: Update LoginPage.jsx

Ganti logic login yang simulasi dengan real API call:

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';

export default function LoginPage() {
  const [nomorPeserta, setNomorPeserta] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(nomorPeserta, password);

    if (result.success) {
      // Redirect ke exam page (sesuaikan examId dari response)
      navigate('/exam/1'); // atau dari result.data.exam_id
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Platform CBT</h1>
        <p className="text-gray-600 mb-6">Silakan login untuk memulai ujian</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Nomor Peserta
            </label>
            <input
              type="text"
              value={nomorPeserta}
              onChange={(e) => setNomorPeserta(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan nomor peserta"
              required
              disabled={isLoading}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan password"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

### Step 2: Update ExamPage.jsx

Wrap dengan ExamProvider dan gunakan useExam hook:

```jsx
import { useParams } from 'react-router-dom';
import { ExamProvider, useExam } from '../contexts/ExamContext';
import { LoadingSpinner } from './LoadingSpinner';
import { ConfirmModal } from './ConfirmModal';
import { ReviewPage } from './ReviewPage';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import Timer from './Timer';
import QuestionGrid from './QuestionGrid';
import QuestionDisplay from './QuestionDisplay';
import { useState } from 'react';

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

  const [showReview, setShowReview] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Keyboard navigation
  useKeyboardNavigation({
    onNext: nextQuestion,
    onPrevious: previousQuestion,
    onSubmit: () => setShowReview(true),
    enabled: !showReview && !showSubmitConfirm,
  });

  const handleSubmit = async () => {
    const result = await handleSubmitExam();
    if (result.success) {
      // Redirect to result page or show success message
      alert('Ujian berhasil disubmit!');
    } else {
      alert('Gagal submit ujian: ' + result.error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Memuat ujian..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{exam?.title}</h1>
          <p className="text-sm text-gray-600">
            Soal {currentQuestionIndex + 1} dari {questions.length}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {isSaving && (
            <span className="text-sm text-gray-600">Menyimpan...</span>
          )}
          <Timer timeRemaining={timeRemaining} />
          <button
            onClick={() => setShowReview(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Selesai Ujian
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md p-4 min-h-[calc(100vh-73px)]">
          <div className="mb-4">
            <p className="text-sm text-gray-600">Dijawab: {answeredCount}</p>
            <p className="text-sm text-gray-600">Ragu: {doubtfulCount}</p>
          </div>
          <QuestionGrid
            questions={questions}
            currentIndex={currentQuestionIndex}
            answers={answers}
            doubtfulQuestions={doubtfulQuestions}
            onSelectQuestion={goToQuestion}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <QuestionDisplay
            question={currentQuestion}
            selectedAnswer={answers[currentQuestion?.id]}
            onSelectAnswer={(answer) => setAnswer(currentQuestion.id, answer)}
            isDoubtful={doubtfulQuestions.has(currentQuestion?.id)}
          />

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <button
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sebelumnya
            </button>
            <button
              onClick={() => toggleDoubtful(currentQuestion.id)}
              className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              {doubtfulQuestions.has(currentQuestion?.id) ? 'Batal Ragu' : 'Ragu-ragu'}
            </button>
            <button
              onClick={nextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Selanjutnya
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
        title="Konfirmasi Submit"
        message="Apakah Anda yakin ingin mengakhiri ujian? Jawaban tidak dapat diubah setelah submit."
        confirmText="Ya, Submit"
        cancelText="Batal"
        isDestructive={true}
      />
    </div>
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
```

### Step 3: Update Timer.jsx

```jsx
import { Clock } from 'lucide-react';

export default function Timer({ timeRemaining }) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isWarning = timeRemaining < 300; // < 5 minutes

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
        isWarning
          ? 'bg-red-100 text-red-700 animate-pulse'
          : 'bg-blue-100 text-blue-700'
      }`}
    >
      <Clock className="w-5 h-5" />
      <span className="font-bold text-lg">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
```

### Step 4: Update QuestionGrid.jsx

```jsx
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';

export default function QuestionGrid({
  questions,
  currentIndex,
  answers,
  doubtfulQuestions,
  onSelectQuestion,
}) {
  const getQuestionStatus = (question, index) => {
    if (index === currentIndex) return 'active';
    if (doubtfulQuestions.has(question.id)) return 'doubtful';
    if (answers[question.id]) return 'answered';
    return 'unanswered';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-blue-600 text-white';
      case 'answered':
        return 'bg-green-500 text-white';
      case 'doubtful':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'answered':
        return <CheckCircle className="w-4 h-4" />;
      case 'doubtful':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  return (
    <div className="grid grid-cols-5 gap-2">
      {questions.map((question, index) => {
        const status = getQuestionStatus(question, index);
        return (
          <button
            key={question.id}
            onClick={() => onSelectQuestion(index)}
            className={`aspect-square flex flex-col items-center justify-center rounded-lg font-semibold transition ${getStatusColor(
              status
            )} hover:opacity-80`}
          >
            {getStatusIcon(status)}
            <span className="text-xs mt-1">{index + 1}</span>
          </button>
        );
      })}
    </div>
  );
}
```

### Step 5: Update QuestionDisplay.jsx

```jsx
export default function QuestionDisplay({
  question,
  selectedAnswer,
  onSelectAnswer,
  isDoubtful,
}) {
  if (!question) return null;

  const options = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Question Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">
          Soal No. {question.number}
        </h2>
        {isDoubtful && (
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
            Ragu-ragu
          </span>
        )}
      </div>

      {/* Question Text */}
      <div className="mb-6">
        <p className="text-gray-800 text-lg leading-relaxed">
          {question.question}
        </p>
        {question.image && (
          <img
            src={question.image}
            alt="Soal"
            className="mt-4 max-w-full rounded-lg"
            loading="lazy"
          />
        )}
      </div>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option}
            className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition ${
              selectedAnswer === option
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400'
            }`}
          >
            <input
              type="radio"
              name="answer"
              value={option}
              checked={selectedAnswer === option}
              onChange={() => onSelectAnswer(option)}
              className="mt-1 mr-3"
            />
            <div className="flex-1">
              <span className="font-semibold text-gray-900 mr-2">
                {option}.
              </span>
              <span className="text-gray-800">
                {question.options?.[option] || `Opsi ${option}`}
              </span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
```

## 🔧 Configuration

### Update .env

```bash
VITE_API_BASE_URL=http://localhost:8000/api
```

Sesuaikan dengan URL backend kamu.

## ✅ Testing Checklist

Setelah integration, test hal-hal berikut:

- [ ] Login dengan credentials valid
- [ ] Login dengan credentials invalid (error handling)
- [ ] Redirect ke exam page setelah login
- [ ] Load exam data dari API
- [ ] Load questions dari API
- [ ] Select answer (UI update)
- [ ] Auto-save answer (check network tab)
- [ ] Navigate dengan tombol
- [ ] Navigate dengan keyboard (arrow keys)
- [ ] Mark as doubtful
- [ ] Timer countdown
- [ ] Review page
- [ ] Submit exam
- [ ] Network offline indicator
- [ ] Token expired handling

## 🐛 Common Issues

### Issue: CORS Error
**Solution:** Backend harus enable CORS untuk `http://localhost:5173`

### Issue: 401 Unauthorized
**Solution:** Check token di sessionStorage, verify backend authentication

### Issue: Questions tidak muncul
**Solution:** Check API response format, pastikan sesuai dengan expected format

### Issue: Auto-save tidak jalan
**Solution:** Check network tab, verify API endpoint correct

## 📞 Need Help?

Jika ada error atau issue:
1. Check browser console untuk error messages
2. Check Network tab untuk API calls
3. Verify API response format
4. Check backend logs
5. Review BACKEND_COORDINATION.md untuk API contract
