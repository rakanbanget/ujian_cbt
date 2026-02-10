import { Clock } from 'lucide-react';

export default function Timer({ timeRemaining }) {
  if (timeRemaining === null || timeRemaining === undefined) {
    return null;
  }

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isWarning = timeRemaining < 300; // < 5 minutes
  const isCritical = timeRemaining < 60; // < 1 minute

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono transition-all ${
        isCritical
          ? 'bg-red-600 text-white animate-pulse shadow-lg'
          : isWarning
          ? 'bg-red-100 text-red-700 animate-pulse'
          : 'bg-blue-100 text-blue-700'
      }`}
    >
      <Clock className={`w-5 h-5 ${isCritical ? 'animate-bounce' : ''}`} />
      <span className="font-bold text-lg">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
