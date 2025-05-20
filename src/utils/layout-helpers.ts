import { useEffect, useState, RefObject } from 'react';

/**
 * Custom hook to detect scroll position and apply different styles
 * @param threshold Scroll position threshold to trigger the change
 * @returns Boolean indicating if page is scrolled beyond threshold
 */
export const useScrollPosition = (threshold: number = 75): boolean => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    // Initial check on mount
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isScrolled;
};

/**
 * Hook to handle clicks outside of a specified element
 * @param ref Reference to the element to monitor
 * @param callback Function to call when clicked outside
 */
export const useClickOutside = (
  ref: RefObject<HTMLElement>,
  callback: () => void
): void => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
};

/**
 * Hook to handle body scroll locking (used in modals and menus)
 * @param isLocked Whether to lock the body scroll
 */
export const useBodyScrollLock = (isLocked: boolean): void => {
  useEffect(() => {
    if (isLocked) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLocked]);
};

/**
 * Hook to handle keyboard navigation (Escape key, etc.)
 * @param onEscape Callback function when Escape key is pressed
 */
export const useKeyboardNavigation = (onEscape?: () => void): void => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onEscape) {
        onEscape();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onEscape]);
};