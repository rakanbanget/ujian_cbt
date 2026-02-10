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
        return 'bg-blue-600 text-white border-blue-700 shadow-lg scale-110';
      case 'answered':
        return 'bg-green-500 text-white hover:bg-green-600';
      case 'doubtful':
        return 'bg-yellow-500 text-white hover:bg-yellow-600';
      default:
        return 'bg-gray-200 text-gray-700 hover:bg-gray-300';
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
            className={`aspect-square flex flex-col items-center justify-center rounded-lg font-semibold transition-all border-2 ${getStatusColor(
              status
            )}`}
            title={`Soal ${index + 1} - ${status}`}
          >
            {getStatusIcon(status)}
            <span className="text-xs mt-1">{index + 1}</span>
          </button>
        );
      })}
    </div>
  );
}
