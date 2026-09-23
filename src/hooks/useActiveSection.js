import { useEffect, useState } from 'react';

/** Mirrors the original scroll-spy: highlights whichever section[id] the viewport is currently over. */
export default function useActiveSection(sectionIds, initial = sectionIds[0]) {
  const [active, setActive] = useState(initial);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          setActive(id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionIds.join(',')]);

  return active;
}
