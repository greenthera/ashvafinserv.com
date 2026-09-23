import { useEffect, useRef, useState } from 'react';

/** Eases 0 → target over 1.5s once `start` becomes true (mirrors the original stat counter). */
export default function useCountUp(target, start) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!start || started.current) return;
    started.current = true;

    const duration = 1500;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.floor(eased * target));

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    }

    requestAnimationFrame(tick);
  }, [start, target]);

  return value;
}
