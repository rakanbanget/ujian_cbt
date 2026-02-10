import { useEffect, useState } from 'react';
import { useExamSecurity } from '../hooks/useExamSecurity';
import { AlertTriangle, Shield } from 'lucide-react';

export const ExamSecurityWrapper = ({ children, enableSecurity = true, onAutoSubmit }) => {
  const [showWarning, setShowWarning] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [lastViolation, setLastViolation] = useState(null);
  const [showCriticalWarning, setShowCriticalWarning] = useState(false);

  const MAX_VIOLATIONS = 3; // Auto-submit after 3 violations

  const handleViolation = (violation) => {
    const newCount = violationCount + 1;
    setViolationCount(newCount);
    setLastViolation(violation);
    setShowWarning(true);

    // Log violation (in production, send to backend)
    console.warn('Security Violation:', violation, `Count: ${newCount}/${MAX_VIOLATIONS}`);

    // Check violation level
    if (newCount >= MAX_VIOLATIONS) {
      // Critical: Auto-submit exam
      setShowCriticalWarning(true);
      
      // Auto-submit after 5 seconds
      setTimeout(() => {
        console.warn('AUTO-SUBMITTING EXAM due to security violations');
        onAutoSubmit?.();
      }, 5000);
    } else if (newCount === MAX_VIOLATIONS - 1) {
      // Warning: Last chance
      setShowCriticalWarning(true);
      setTimeout(() => {
        setShowCriticalWarning(false);
      }, 10000);
    } else {
      // Normal warning
      setTimeout(() => {
        setShowWarning(false);
      }, 5000);
    }
  };

  const { violations } = useExamSecurity({
    onViolation: handleViolation,
    enabled: enableSecurity,
  });

  // Disable text selection (only if security enabled)
  useEffect(() => {
    if (!enableSecurity) return;

    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.mozUserSelect = 'none';
    document.body.style.msUserSelect = 'none';

    return () => {
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      document.body.style.mozUserSelect = '';
      document.body.style.msUserSelect = '';
    };
  }, [enableSecurity]);

  // Disable browser extensions (attempt)
  useEffect(() => {
    if (!enableSecurity) return;

    // Add meta tag to disable translation
    const meta = document.createElement('meta');
    meta.name = 'google';
    meta.content = 'notranslate';
    document.head.appendChild(meta);

    // Add translate attribute to body
    document.body.setAttribute('translate', 'no');
    document.documentElement.setAttribute('translate', 'no');

    // Add class to disable translation
    document.body.classList.add('notranslate');

    return () => {
      document.head.removeChild(meta);
      document.body.removeAttribute('translate');
      document.documentElement.removeAttribute('translate');
      document.body.classList.remove('notranslate');
    };
  }, [enableSecurity]);

  // Request fullscreen on mount
  useEffect(() => {
    if (!enableSecurity) return;

    const requestFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch (err) {
        console.warn('Fullscreen request failed:', err);
      }
    };

    // Delay to avoid blocking initial render
    setTimeout(requestFullscreen, 1000);

    // Detect fullscreen exit
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        handleViolation({
          type: 'FULLSCREEN_EXIT',
          message: 'User exited fullscreen mode',
          timestamp: new Date().toISOString(),
        });
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [enableSecurity]);

  const getWarningMessage = () => {
    if (violationCount >= MAX_VIOLATIONS) {
      return {
        title: '🚨 UJIAN AKAN DISUBMIT OTOMATIS!',
        message: 'Terlalu banyak pelanggaran keamanan. Ujian akan disubmit dalam 5 detik...',
        bgColor: 'bg-red-700',
      };
    } else if (violationCount === MAX_VIOLATIONS - 1) {
      return {
        title: '⚠️ PERINGATAN TERAKHIR!',
        message: `Ini pelanggaran ke-${violationCount}. Satu pelanggaran lagi dan ujian akan disubmit otomatis!`,
        bgColor: 'bg-orange-600',
      };
    } else {
      return {
        title: '⚠️ Peringatan Keamanan',
        message: `${lastViolation?.message || 'Aktivitas mencurigakan terdeteksi'}. Pelanggaran: ${violationCount}/${MAX_VIOLATIONS}`,
        bgColor: 'bg-yellow-600',
      };
    }
  };

  return (
    <div className="relative">
      {/* Security Warning Banner */}
      {showWarning && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-bounce max-w-2xl">
          <div className={`${getWarningMessage().bgColor} text-white px-6 py-4 rounded-lg shadow-2xl`}>
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="font-bold text-lg mb-1">{getWarningMessage().title}</p>
                <p className="text-sm">{getWarningMessage().message}</p>
                {violationCount < MAX_VIOLATIONS && (
                  <p className="text-xs mt-2 opacity-90">
                    Jangan keluar dari fullscreen, jangan switch tab, dan jangan minimize window!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Critical Warning Modal (Last Chance) */}
      {showCriticalWarning && violationCount === MAX_VIOLATIONS - 1 && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-3xl font-bold text-red-600 mb-4">
              PERINGATAN TERAKHIR!
            </h2>
            <p className="text-gray-800 text-lg mb-4">
              Ini adalah pelanggaran keamanan ke-{violationCount} dari {MAX_VIOLATIONS}.
            </p>
            <p className="text-gray-700 mb-6">
              <strong>Satu pelanggaran lagi</strong> dan ujian Anda akan <strong>disubmit otomatis</strong>!
            </p>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-left">
              <p className="text-sm text-red-800 font-semibold mb-2">
                Jangan lakukan:
              </p>
              <ul className="text-sm text-red-700 space-y-1">
                <li>❌ Keluar dari fullscreen mode</li>
                <li>❌ Switch ke tab lain</li>
                <li>❌ Minimize window</li>
                <li>❌ Klik di luar browser</li>
              </ul>
            </div>
            <button
              onClick={() => setShowCriticalWarning(false)}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}

      {/* Auto-Submit Countdown Modal */}
      {violationCount >= MAX_VIOLATIONS && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="text-6xl mb-4 animate-pulse">🚨</div>
            <h2 className="text-3xl font-bold text-red-600 mb-4">
              UJIAN DISUBMIT OTOMATIS
            </h2>
            <p className="text-gray-800 text-lg mb-4">
              Terlalu banyak pelanggaran keamanan terdeteksi.
            </p>
            <p className="text-gray-700 mb-6">
              Ujian Anda akan disubmit secara otomatis dalam beberapa detik...
            </p>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-left">
              <p className="text-sm text-red-800">
                <strong>Total Pelanggaran:</strong> {violationCount}
              </p>
              <p className="text-sm text-red-700 mt-2">
                Hasil ujian akan ditinjau oleh pengawas.
              </p>
            </div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-red-600 mx-auto"></div>
          </div>
        </div>
      )}

      {/* Security Indicator */}
      {enableSecurity && (
        <div className="fixed bottom-4 right-4 z-40">
          <div className="bg-green-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-semibold">Secure Mode</span>
          </div>
        </div>
      )}

      {/* Violation Counter (for admin/debug) */}
      {enableSecurity && violationCount > 0 && (
        <div className="fixed bottom-4 left-4 z-40">
          <div className="bg-yellow-600 text-white px-4 py-2 rounded-full shadow-lg">
            <span className="text-sm font-semibold">
              Violations: {violationCount}
            </span>
          </div>
        </div>
      )}

      {/* Main Content */}
      {children}
    </div>
  );
};
