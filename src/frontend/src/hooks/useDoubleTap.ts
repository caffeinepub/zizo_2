import { useRef } from 'react';

export function useDoubleTap(callback: () => void, delay = 300) {
  const lastTapRef = useRef<number>(0);

  const handleTap = () => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;

    if (timeSinceLastTap < delay && timeSinceLastTap > 0) {
      callback();
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  };

  return {
    onClick: handleTap,
    onTouchEnd: handleTap,
  };
}
