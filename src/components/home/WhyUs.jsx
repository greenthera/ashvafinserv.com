import useReveal from '../../hooks/useReveal.js';
import SectionHeader from '../SectionHeader.jsx';
import PromiseCard from '../PromiseCard.jsx';
import { trustItems, ourPromiseList } from '../../data/siteContent.js';

export default function WhyUs() {
  const grid = useReveal();

  return (
    <section id="why-us" className="py-[72px] lg:py-[100px] bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeader tag="Why Clients Trust Us" title="A Promise Built on Integrity & Long-Term Partnership" />

        <div ref={grid.ref} className={`${grid.className} grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 items-start`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {trustItems.map((item) => (
              <div key={item.title} className="flex gap-4 items-start">
                <div className="w-11 h-11 min-w-[44px] bg-primary-lighter text-primary rounded-[10px] flex items-center justify-center text-base">
                  <i className={`fas ${item.icon}`} />
                </div>
                <div>
                  <h4 className="text-[0.95rem] mb-1">{item.title}</h4>
                  <p className="text-[0.85rem] text-body-light">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <PromiseCard title="Our Promise" items={ourPromiseList} />
        </div>
      </div>
    </section>
  );
}
