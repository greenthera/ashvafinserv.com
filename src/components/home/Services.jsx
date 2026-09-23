import useReveal from '../../hooks/useReveal.js';
import SectionHeader from '../SectionHeader.jsx';
import ServiceCard from '../ServiceCard.jsx';
import { services } from '../../data/siteContent.js';

export default function Services() {
  const grid = useReveal();

  return (
    <section id="services" className="py-[72px] lg:py-[100px] bg-surface">
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeader
          tag="Our Services"
          title="Comprehensive Financial Solutions for Your Family"
          subtitle="We offer end-to-end financial planning that protects, grows, and preserves your wealth across generations."
        />

        <div ref={grid.ref} className={`${grid.className} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7`}>
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}
