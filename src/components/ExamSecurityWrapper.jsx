import { useState } from 'react';
import { useExamSecurity } from '../hooks/useExamSecurity';
import { AlertTriangle, Shield } from 'lucide-react';

export const ExamSecurityWrapper = ({ children, enableSecurity = true }) => {
  const [showWarning, setShowWarning] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [lastViolation, setLastViolation] = useState(null);

  const handleViolation = (violation) => {
    const newCount = violationCount + 1;
    setViolationCount(newCount);
    setLastViolation(violation);
    setShowWarning(true);

    // Hanya log, tidak ada aksi apapun
    console.warn('Peringatan:', violation.message, `(${newCount}x)`);

    // Tutup banner otomatis setelah 6 detik
    setTimeout(() => {
      setShowWarning(false);
    }, 6000);
  };

  // Deteksi pelanggaran (ganti tab, minimize, dll) — hanya untuk memunculkan peringatan
  useExamSecurity({
    onViolation: handleViolation,
    enabled: enableSecurity,
  });

  return (
    <div className="relative">
      {/* Banner Peringatan — hanya informasi, tidak ada aksi */}
      {showWarning && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-bounce max-w-2xl w-full px-4">
          <div className="bg-yellow-500 text-white px-6 py-4 rounded-lg shadow-2xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="font-bold text-lg mb-1">⚠️ Peringatan</p>
                <p className="text-sm">
                  {lastViolation?.message || 'Anda berpindah dari halaman ujian.'}
                </p>
              </div>
              <button
                onClick={() => setShowWarning(false)}
                className="text-white opacity-70 hover:opacity-100 text-xl font-bold ml-2 flex-shrink-0"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Indikator jumlah peringatan */}
      {enableSecurity && violationCount > 0 && (
        <div className="fixed bottom-4 left-4 z-40">
          <div className="bg-yellow-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-semibold">
              Peringatan: {violationCount}x
            </span>
          </div>
        </div>
      )}

      {children}
    </div>
  );
};
