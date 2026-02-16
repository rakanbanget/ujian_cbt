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
      <div className="space-y-4">
        {options.map((option) => {
          const optionData = question.options?.[option];
          if (!optionData || (!optionData.text && !optionData.image)) return null;

          const isSelected = selectedAnswer === option;
          const { text, image } = optionData;

          return (
            <label
              key={option}
              className={`flex items-start p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${isSelected
                ? 'border-primary bg-primary/5 shadow-md scale-[1.01]'
                : 'border-gray-200 hover:border-primary/40 hover:bg-gray-50'
                }`}
            >
              <input
                type="radio"
                name="answer"
                value={option}
                checked={isSelected}
                onChange={() => onSelectAnswer(option)}
                className="mt-1.5 mr-4 w-5 h-5 text-primary focus:ring-primary"
              />
              <div className="flex flex-col gap-3 flex-1">
                <div className="flex items-center gap-4">
                  <span
                    className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full font-bold transition-colors ${isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                  >
                    {option}
                  </span>

                  {text && (
                    <span
                      className={`text-lg transition-colors ${isSelected ? 'text-primary-900 font-semibold' : 'text-gray-800'
                        }`}
                    >
                      {text}
                    </span>
                  )}
                </div>

                {image && (
                  <div className="ml-12 mt-1">
                    <img
                      src={image}
                      alt={`Opsi ${option}`}
                      className="max-h-64 rounded-lg border border-gray-200 shadow-sm hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </div>
                )}
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
