import { useEffect, useRef, useState } from 'react';

/**
 * Replicates the original [data-animate] + IntersectionObserver fade-in-up.
 * Attach `ref` to the element and spread `className` alongside any other classes.
 */
export default function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: '0px 0px -80px 0px', threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, className: `reveal${visible ? ' reveal-visible' : ''}` };
}
