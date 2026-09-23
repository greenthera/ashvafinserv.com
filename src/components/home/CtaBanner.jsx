import useReveal from '../../hooks/useReveal.js';
import Button from '../Button.jsx';

export default function CtaBanner() {
  const content = useReveal();

  return (
    <section
      className="cta-banner relative overflow-hidden py-20"
      style={{ background: 'linear-gradient(145deg, #1B6B2A, #0D4A1A)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 10% 50%, rgba(255,255,255,0.06) 0%, transparent 50%), radial-gradient(circle at 90% 30%, rgba(200,169,81,0.1) 0%, transparent 40%)',
        }}
      />

      <div className="relative max-w-[1200px] mx-auto px-6">
        <div ref={content.ref} className={`${content.className} text-center`}>
          <h2 className="text-white mb-3">Ready to Take Control of Your Financial Future?</h2>
          <p className="text-white/80 text-[1.1rem] mb-8">
            Smart Planning, Secure Future — Start your journey with Ashva Finserv today.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button href="tel:+919327620268" variant="white" size="lg">
              <i className="fas fa-phone" /> Call Now
            </Button>
            <Button href="#contact" variant="outline-white" size="lg">
              <i className="fas fa-calendar-check" /> Book Session
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
