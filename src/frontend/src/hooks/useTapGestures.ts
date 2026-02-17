import { useRef, useCallback } from 'react';

interface TapGestureOptions {
  onSingleTap?: () => void;
  onDoubleTap?: () => void;
  delay?: number;
}

export function useTapGestures({ onSingleTap, onDoubleTap, delay = 300 }: TapGestureOptions) {
  const lastTapRef = useRef<number>(0);
  const singleTapTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleTap = useCallback(() => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;

    if (timeSinceLastTap < delay && timeSinceLastTap > 0) {
      // Double tap detected
      if (singleTapTimerRef.current) {
        clearTimeout(singleTapTimerRef.current);
        singleTapTimerRef.current = null;
      }
      if (onDoubleTap) {
        onDoubleTap();
      }
      lastTapRef.current = 0;
    } else {
      // Potential single tap - wait to see if double tap follows
      lastTapRef.current = now;
      if (onSingleTap) {
        singleTapTimerRef.current = setTimeout(() => {
          onSingleTap();
          singleTapTimerRef.current = null;
        }, delay);
      }
    }
  }, [onSingleTap, onDoubleTap, delay]);

  return {
    onClick: handleTap,
    onTouchEnd: handleTap,
  };
}
