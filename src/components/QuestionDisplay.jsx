import { AlertCircle } from 'lucide-react';

export default function QuestionDisplay({
  question,
  selectedAnswer,
  onSelectAnswer,
  isDoubtful,
}) {
  if (!question) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500">Tidak ada soal untuk ditampilkan</p>
      </div>
    );
  }

  const options = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      {/* Question Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <h2 className="text-xl font-bold text-gray-900">
          Soal Nomor {question.number}
        </h2>
        {isDoubtful && (
          <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Ragu-ragu
          </span>
        )}
      </div>

      {/* Question Text */}
      <div className="mb-8">
        <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
          {question.question}
        </p>
        {question.image && (
          <div className="mt-6">
            <img
              src={question.image}
              alt={`Soal ${question.number}`}
              className="max-w-full rounded-lg shadow-md"
              loading="lazy"
            />
          </div>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = selectedAnswer === option;
          const optionText = question.options?.[option] || `Opsi ${option}`;

          return (
            <label
              key={option}
              className={`flex items-start p-5 border-2 rounded-lg cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50 shadow-md'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="answer"
                value={option}
                checked={isSelected}
                onChange={() => onSelectAnswer(option)}
                className="mt-1 mr-4 w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex-1">
                <span
                  className={`font-bold mr-3 ${
                    isSelected ? 'text-blue-600' : 'text-gray-900'
                  }`}
                >
                  {option}.
                </span>
                <span
                  className={`${
                    isSelected ? 'text-gray-900 font-medium' : 'text-gray-800'
                  }`}
                >
                  {optionText}
                </span>
              </div>
            </label>
          );
        })}
      </div>

      {/* Helper Text */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          💡 <strong>Tips:</strong> Pilih salah satu jawaban di atas. Jawaban akan tersimpan otomatis.
        </p>
      </div>
    </div>
  );
}
