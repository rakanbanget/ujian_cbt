import { AlertCircle, CheckCircle2, XCircle, MinusCircle, Info } from 'lucide-react';

const SCALE_MAP = {
  A: { text: 'Sangat Tidak Sesuai', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200', icon: XCircle },
  B: { text: 'Tidak Sesuai', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', icon: MinusCircle },
  C: { text: 'Netral', color: 'text-gray-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-200', icon: Info },
  D: { text: 'Sesuai', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200', icon: CheckCircle2 },
  E: { text: 'Sangat Sesuai', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', icon: CheckCircle2 },
};

function ScaleLegend() {
  return (
    <div className="mb-8 p-4 md:p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-gray-900 text-sm md:text-base">Panduan Pilihan Jawaban</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {Object.entries(SCALE_MAP).map(([key, value]) => {
          const Icon = value.icon;
          return (
            <div
              key={key}
              className={`flex items-center gap-3 p-3 rounded-xl border ${value.borderColor} ${value.bgColor} transition-all hover:shadow-md`}
            >
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white rounded-lg font-bold text-primary shadow-sm">
                {key}
              </span>
              <div className="flex flex-col">
                <span className={`text-[10px] md:text-xs font-black uppercase tracking-tighter mb-0.5 ${value.color}`}>
                  {value.text}
                </span>
                <span className="text-[10px] md:text-xs text-gray-500 font-medium leading-none">
                  Pilihan {key}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function QuestionDisplay({
  question,
  selectedAnswer,
  onSelectAnswer,
  isDoubtful,
  examTitle = '',
}) {
  if (!question) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 md:p-8 text-center">
        <p className="text-gray-500">Tidak ada soal untuk ditampilkan</p>
      </div>
    );
  }

  const options = ['A', 'B', 'C', 'D', 'E'];

  const isPemetaanDiri = examTitle?.toLowerCase().includes('pemetaan') || 
                         examTitle?.toLowerCase().includes('diri') || 
                         examTitle?.toLowerCase().includes('assessment');

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-8">
      {isPemetaanDiri && <ScaleLegend />}
      {/* Question Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6 pb-4 border-b">
        <h2 className="text-lg md:text-xl font-bold text-gray-900">
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
      <div className="mb-6 md:mb-8">
        <p className="text-gray-800 text-sm md:text-lg leading-relaxed whitespace-pre-wrap">
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
          let optionData = question.options?.[option];

          // Handle cases where optionData might be missing
          if (!optionData && !isPemetaanDiri) return null;

          // Fallback for string format
          if (typeof optionData === 'string') {
            optionData = { text: optionData };
          } else if (!optionData) {
            optionData = { text: '', image: null };
          }

          const isSelected = selectedAnswer === option;
          const text = optionData.text?.trim() || (isPemetaanDiri ? SCALE_MAP[option].text : '');
          const image = optionData.image;

          return (
            <label
              key={option}
              className={`flex items-start p-3 md:p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${isSelected
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
                className="mt-1.5 mr-3 md:mr-4 w-4 h-4 md:w-5 h-5 text-primary focus:ring-primary"
              />
              <div className="flex flex-col gap-2 md:gap-3 flex-1">
                <div className="flex items-center gap-3 md:gap-4">
                  <span
                    className={`flex-shrink-0 w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full font-bold transition-colors text-xs md:text-base ${isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                  >
                    {option}
                  </span>

                  {text && (
                    <span
                      className={`text-sm md:text-lg transition-colors ${isSelected ? 'text-primary-900 font-semibold' : 'text-gray-800'
                        }`}
                    >
                      {text}
                    </span>
                  )}
                </div>

                {image && (
                  <div className="ml-0 md:ml-12 mt-1">
                    <img
                      src={image}
                      alt={`Opsi ${option}`}
                      className="max-h-48 md:max-h-64 rounded-lg border border-gray-200 shadow-sm hover:scale-105 transition-transform w-auto h-auto"
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
