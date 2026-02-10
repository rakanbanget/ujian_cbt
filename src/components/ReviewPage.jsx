import { useExam } from '../contexts/ExamContext';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';

export const ReviewPage = ({ onClose, onSubmit }) => {
  const { questions, answers, doubtfulQuestions, goToQuestion } = useExam();

  const getStatusIcon = (questionId) => {
    if (doubtfulQuestions.has(questionId)) {
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
    if (answers[questionId]) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    return <Circle className="w-5 h-5 text-gray-300" />;
  };

  const unansweredCount = questions.length - Object.keys(answers).length;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Review Jawaban</h2>
          <p className="text-gray-600 mt-1">
            Periksa kembali jawaban Anda sebelum submit
          </p>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Sudah Dijawab</p>
              <p className="text-2xl font-bold text-green-600">
                {Object.keys(answers).length} / {questions.length}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Ragu-ragu</p>
              <p className="text-2xl font-bold text-yellow-600">
                {doubtfulQuestions.size}
              </p>
            </div>
          </div>

          {unansweredCount > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 font-semibold">
                ⚠️ Masih ada {unansweredCount} soal yang belum dijawab
              </p>
            </div>
          )}

          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
            {questions.map((question, index) => (
              <button
                key={question.id}
                onClick={() => {
                  goToQuestion(index);
                  onClose();
                }}
                className="aspect-square flex flex-col items-center justify-center p-2 rounded-lg border-2 hover:border-blue-500 transition"
              >
                {getStatusIcon(question.id)}
                <span className="text-sm font-semibold mt-1">{index + 1}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 border-t flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Kembali
          </button>
          <button
            onClick={onSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Submit Ujian
          </button>
        </div>
      </div>
    </div>
  );
};
