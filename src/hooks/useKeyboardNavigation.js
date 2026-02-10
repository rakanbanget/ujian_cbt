import { useEffect } from 'react';

export const useKeyboardNavigation = ({ onNext, onPrevious, onSubmit, enabled = true }) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyPress = (e) => {
      // Ignore if user is typing in input/textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      switch (e.key) {
        case 'ArrowRight':
        case 'n':
          e.preventDefault();
          onNext?.();
          break;
        case 'ArrowLeft':
        case 'p':
          e.preventDefault();
          onPrevious?.();
          break;
        case 'Enter':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            onSubmit?.();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onNext, onPrevious, onSubmit, enabled]);
};
