import { useEffect } from 'react';

/**
 * Prevents body scrolling when enabled is true.
 * Cleans up on unmount or when enabled becomes false.
 */
export function usePreventBodyScroll(enabled: boolean) {
  useEffect(() => {
    if (enabled) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
    // If not enabled, ensure cleanup
    return undefined;
  }, [enabled]);
} 