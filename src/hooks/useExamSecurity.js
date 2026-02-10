import { useEffect, useState } from 'react';

export const useExamSecurity = ({ onViolation, enabled = true }) => {
  const [violations, setViolations] = useState([]);

  useEffect(() => {
    if (!enabled) return;

    // 1. Disable right-click (prevent inspect element)
    const handleContextMenu = (e) => {
      e.preventDefault();
      addViolation('Right-click disabled');
      return false;
    };

    // 2. Disable keyboard shortcuts
    const handleKeyDown = (e) => {
      // Allow form submission (Enter key)
      if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
        return true;
      }

      // Disable F12 (DevTools)
      if (e.key === 'F12') {
        e.preventDefault();
        addViolation('F12 disabled');
        return false;
      }

      // Disable Ctrl+Shift+I (DevTools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        addViolation('DevTools shortcut disabled');
        return false;
      }

      // Disable Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        addViolation('Console shortcut disabled');
        return false;
      }

      // Disable Ctrl+U (View Source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        addViolation('View source disabled');
        return false;
      }

      // Disable Ctrl+S (Save Page)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        addViolation('Save page disabled');
        return false;
      }

      // Disable Ctrl+P (Print)
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        addViolation('Print disabled');
        return false;
      }

      // Disable Ctrl+C (Copy) - optional, bisa di-enable jika perlu
      // if (e.ctrlKey && e.key === 'c') {
      //   e.preventDefault();
      //   addViolation('Copy disabled');
      //   return false;
      // }
    };

    // 3. Detect tab visibility change (user switch tab)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        addViolation('Tab switched or minimized');
        onViolation?.({
          type: 'TAB_SWITCH',
          message: 'User switched to another tab',
          timestamp: new Date().toISOString(),
        });
      }
    };

    // 4. Detect window blur (user clicked outside browser)
    const handleBlur = () => {
      addViolation('Window lost focus');
      onViolation?.({
        type: 'WINDOW_BLUR',
        message: 'User clicked outside browser window',
        timestamp: new Date().toISOString(),
      });
    };

    // 5. Prevent opening new tabs/windows
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'Anda yakin ingin meninggalkan halaman ujian?';
      return e.returnValue;
    };

    // 6. Detect if user tries to open new tab
    const handleKeyDownNewTab = (e) => {
      // Ctrl+T (New Tab)
      if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        addViolation('New tab attempt blocked');
        return false;
      }

      // Ctrl+N (New Window)
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        addViolation('New window attempt blocked');
        return false;
      }

      // Ctrl+W (Close Tab)
      if (e.ctrlKey && e.key === 'w') {
        e.preventDefault();
        addViolation('Close tab attempt blocked');
        return false;
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleKeyDownNewTab);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', handleKeyDownNewTab);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enabled, onViolation]);

  const addViolation = (message) => {
    const violation = {
      message,
      timestamp: new Date().toISOString(),
    };
    setViolations((prev) => [...prev, violation]);
  };

  return { violations };
};
