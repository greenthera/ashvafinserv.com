import { useCallback, useEffect, useState } from 'react';

/** Mobile nav open/close state, plus Escape-to-close and auto-close on resize past the tablet breakpoint. */
export default function useMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((open) => !open), []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [close]);

  useEffect(() => {
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (window.innerWidth > 1024) close();
      }, 150);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [close]);

  return { isOpen, toggle, close };
}
