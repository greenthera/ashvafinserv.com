import useReveal from '../../hooks/useReveal.js';
import SectionHeader from '../SectionHeader.jsx';
import { clientTypes } from '../../data/siteContent.js';

export default function Clients() {
  const grid = useReveal();

  return (
    <section id="clients" className="py-[72px] lg:py-[100px] bg-surface">
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeader
          tag="Who We Serve"
          title="Whether Your Wealth Is Growing or Just Beginning"
          subtitle="You deserve the right guidance — no matter where you are in your financial journey."
        />

        <div ref={grid.ref} className={`${grid.className} grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5`}>
          {clientTypes.map((client) => (
            <div
              key={client.title}
              className="bg-white px-4 py-8 rounded-brand text-center border border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-brand hover:border-primary"
            >
              <i className={`fas ${client.icon} block text-[2rem] text-primary mb-3`} />
              <h4 className="text-[0.85rem] font-body font-semibold text-ink">{client.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
