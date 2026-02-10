import { WifiOff, Wifi } from 'lucide-react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { useEffect, useState } from 'react';

export const NetworkStatus = () => {
  const { isOnline, wasOffline } = useNetworkStatus();
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    if (isOnline && wasOffline) {
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  if (isOnline && !showReconnected) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
        isOnline
          ? 'bg-green-500 text-white'
          : 'bg-red-500 text-white animate-pulse'
      }`}
    >
      {isOnline ? (
        <>
          <Wifi className="w-5 h-5" />
          <span>Koneksi kembali normal</span>
        </>
      ) : (
        <>
          <WifiOff className="w-5 h-5" />
          <span>Tidak ada koneksi internet</span>
        </>
      )}
    </div>
  );
};
