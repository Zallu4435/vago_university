import { useEffect } from 'react';


export function usePreventBodyScroll(enabled: boolean) {
  useEffect(() => {
    if (enabled) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
    return undefined;
  }, [enabled]);
} 