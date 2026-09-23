import useScrollY from '../hooks/useScrollY.js';

export default function BackToTop() {
  const scrollY = useScrollY();
  const visible = scrollY > 600;

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-8 right-8 w-12 h-12 rounded-full bg-primary text-white border-none flex items-center justify-center shadow-[0_4px_15px_rgba(27,107,42,0.3)] z-[900] transition-all duration-300 print:hidden hover:bg-primary-dark hover:-translate-y-1 ${
        visible ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-3'
      }`}
    >
      <i className="fas fa-chevron-up" />
    </button>
  );
}
