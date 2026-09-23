import useReveal from '../../hooks/useReveal.js';
import useInView from '../../hooks/useInView.js';
import useCountUp from '../../hooks/useCountUp.js';
import Button from '../Button.jsx';
import { heroStats } from '../../data/siteContent.js';

function Stat({ target, suffix, label, start, showDivider }) {
  const value = useCountUp(target, start);
  return (
    <>
      <div className="text-center min-w-[120px] flex flex-col items-center gap-1.5">
        <div className="inline-flex items-baseline gap-0.5">
          <span className="font-heading text-[1.6rem] min-[900px]:text-[2rem] font-bold text-primary leading-none">
            {value}
          </span>
          {suffix && <span className="font-heading text-2xl font-bold text-primary">{suffix}</span>}
        </div>
        <span className="block text-[0.8rem] text-body-light mt-1 uppercase tracking-wide">{label}</span>
      </div>
      {showDivider && <div className="hidden min-[900px]:block w-px h-10 bg-border" />}
    </>
  );
}

export default function Hero() {
  const text = useReveal();
  const visual = useReveal();
  const { ref: statsRef, inView } = useInView(0.5);

  return (
    <section
      id="hero"
      className="relative min-h-screen lg:min-h-0 flex items-center pt-[120px] pb-20 lg:pt-[140px] lg:pb-[100px] bg-gradient-to-b from-white via-primary-lighter to-white overflow-hidden"
      style={{ backgroundImage: 'linear-gradient(170deg, #fff 0%, #E8F5E9 50%, #fff 100%)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, rgba(27,107,42,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(200,169,81,0.06) 0%, transparent 40%)',
        }}
      />

      <div className="relative max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_0.5fr] gap-[60px] items-center">
        <div ref={text.ref} className={`${text.className} text-center lg:text-left`}>
          <p className="inline-block px-5 py-2 bg-white border border-border rounded-full text-[0.78rem] lg:text-[0.85rem] font-medium text-primary mb-6">
            Trusted Financial Advisory
          </p>
          <h1 className="mb-6">
            Guiding Families to Financial{' '}
            <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
              Confidence, Clarity
            </span>{' '}
            &amp; Peace of Mind
          </h1>
          <p className="text-[1.1rem] text-body max-w-[560px] mx-auto lg:mx-0 mb-9 leading-[1.8]">
            At Ashva Finserv, we help individuals and families make wise financial decisions for every stage of life —
            with discipline, transparency, and long-term vision.
          </p>
          <p className="text-[0.95rem] text-body-light -mt-4 mb-7 font-semibold tracking-wide">
            Building financial confidence for every stage of life.
          </p>
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-12">
            <Button href="#contact" size="lg">
              Start Your Financial Clarity Journey <i className="fas fa-arrow-right" />
            </Button>
            <Button href="#about" variant="outline" size="lg">
              Learn More About Us
            </Button>
          </div>
          <div ref={statsRef} className="flex flex-wrap items-center gap-5 min-[900px]:gap-8 justify-center lg:justify-start">
            {heroStats.map((stat, i) => (
              <Stat key={stat.label} {...stat} start={inView} showDivider={i < heroStats.length - 1} />
            ))}
          </div>
        </div>

        <div ref={visual.ref} className={`${visual.className} hidden lg:flex justify-center items-center`}>
          <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-dark text-white px-10 py-12 rounded-brand-lg text-center shadow-brand-xl animate-hero-float">
            <div
              className="absolute -top-1/2 -right-1/2 w-[200%] h-[200%] pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 60%)' }}
            />
            <div className="relative text-5xl mb-5 opacity-90">
              <i className="fas fa-shield-halved" />
            </div>
            <h3 className="relative text-white text-[1.6rem] mb-2">Smart Planning</h3>
            <p className="relative text-[1.1rem] opacity-85 font-light">Secure Future</p>
          </div>
        </div>
      </div>

      <div className="hidden lg:block absolute bottom-8 left-1/2 -translate-x-1/2">
        <a href="#about" aria-label="Scroll down">
          <span className="block w-[26px] h-[42px] border-2 border-primary rounded-full relative">
            <span className="absolute left-1/2 -translate-x-1/2 top-2 w-1 h-2 bg-primary rounded-sm animate-scroll-bounce" />
          </span>
        </a>
      </div>
    </section>
  );
}
