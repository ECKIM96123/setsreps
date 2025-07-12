import { useEffect, useRef } from 'react';

interface SwipeNavigationOptions {
  onSwipeBack?: () => void;
  threshold?: number;
  restraint?: number;
  allowedTime?: number;
}

export const useSwipeNavigation = ({
  onSwipeBack,
  threshold = 100,
  restraint = 100,
  allowedTime = 300
}: SwipeNavigationOptions) => {
  const swipeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!swipeRef.current || !onSwipeBack) return;

    let startX = 0;
    let startY = 0;
    let startTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
      const touchobj = e.changedTouches[0];
      startX = touchobj.pageX;
      startY = touchobj.pageY;
      startTime = new Date().getTime();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchobj = e.changedTouches[0];
      const distX = touchobj.pageX - startX;
      const distY = touchobj.pageY - startY;
      const elapsedTime = new Date().getTime() - startTime;

      // Check if it's a valid swipe (right direction, sufficient distance, within time limit)
      if (elapsedTime <= allowedTime && 
          distX >= threshold && 
          Math.abs(distY) <= restraint &&
          startX <= 50) { // Only trigger if starting from left edge
        onSwipeBack();
      }
    };

    const element = swipeRef.current;
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeBack, threshold, restraint, allowedTime]);

  return swipeRef;
};