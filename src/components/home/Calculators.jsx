import useReveal from '../../hooks/useReveal.js';
import { calculatorCards } from '../../data/siteContent.js';

export default function Calculators() {
  const grid = useReveal();

  return (
    <section
      id="calculators"
      className="relative overflow-hidden py-[72px] lg:py-[100px] text-white"
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
        <div className="text-center max-w-[680px] mx-auto mb-[60px]">
          <span className="inline-block px-[18px] py-[6px] bg-white/15 text-white text-[0.85rem] font-semibold rounded-full mb-4 tracking-wide uppercase">
            Free Tools
          </span>
          <h2 className="text-white">Plan Your Finances With Our Calculators</h2>
          <p className="text-white/85 text-[1.05rem] mt-3">
            Get instant, accurate projections for your home loan and investments — free, with a downloadable PDF
            report.
          </p>
        </div>

        <div ref={grid.ref} className={`${grid.className} grid grid-cols-1 sm:grid-cols-2 gap-8`}>
          {calculatorCards.map((card) => (
            <a
              key={card.href}
              href={card.href}
              className="group relative block bg-white text-center rounded-brand-lg px-9 py-11 border border-border overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-brand-xl hover:border-transparent"
            >
              <div className="w-[72px] h-[72px] mx-auto mb-6 bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl flex items-center justify-center text-[1.8rem] transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-2">
                <i className={`fas ${card.icon}`} />
              </div>
              <h3 className="mb-3 text-ink">{card.title}</h3>
              <p className="text-body-light text-[0.95rem] leading-[1.7] mb-5">{card.text}</p>
              <span className="inline-flex items-center gap-2 bg-primary text-white rounded-full px-7 py-3 font-semibold text-[0.95rem] transition-all duration-300 group-hover:bg-primary-dark group-hover:-translate-y-0.5 group-hover:shadow-[0_8px_25px_rgba(27,107,42,0.3)]">
                Open Calculator <i className="fas fa-arrow-right" />
              </span>
              <span className="absolute bottom-0 left-0 w-full h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 bg-gradient-to-r from-primary to-accent" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
