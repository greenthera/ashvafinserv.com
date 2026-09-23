import useReveal from '../../hooks/useReveal.js';
import SectionHeader from '../SectionHeader.jsx';
import { pillars } from '../../data/siteContent.js';

export default function MissionVision() {
  const visionBlock = useReveal();
  const pillarsGrid = useReveal();

  return (
    <section id="mission-vision" className="py-[72px] lg:py-[100px] bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeader tag="Our Purpose" title="Vision & What Makes Us Different" />

        <div
          ref={visionBlock.ref}
          className={`${visionBlock.className} flex items-start bg-white border-l-4 border-primary rounded-2xl px-10 py-9 shadow-brand`}
        >
          <div>
            <h3 className="font-heading text-[1.2rem] text-primary mb-3">Vision Statement</h3>
            <p className="text-[1.05rem] text-body leading-[1.75] italic">
              &quot;To be the most trusted catalyst for financial literacy across generations, empowering every
              individual with personalized, goal-oriented strategies that turn lifelong aspirations into realities
              through a steadfast customer-first approach.&quot;
            </p>
          </div>
        </div>

        <div className="text-center max-w-[680px] mx-auto mt-12 mb-[60px]">
          <h3 className="font-heading text-[1.6rem] text-ink mb-2">How We Are Different</h3>
          <p className="text-body-light text-[1.05rem] mt-3">
            In a crowded market of product sellers, Ashva Finserv stands out through three core pillars:
          </p>
        </div>

        <div ref={pillarsGrid.ref} className={`${pillarsGrid.className} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7`}>
          {pillars.map((pillar) => (
            <div
              key={pillar.number}
              className="bg-white rounded-2xl px-7 py-9 shadow-brand border-t-4 border-primary transition-all duration-300 hover:-translate-y-1.5 hover:shadow-brand-lg"
            >
              <div className="font-heading text-5xl font-bold text-primary-lighter leading-none mb-3">{pillar.number}</div>
              <div className="w-12 h-12 bg-primary-lighter text-primary rounded-xl flex items-center justify-center text-[1.2rem] mb-4">
                <i className={`fas ${pillar.icon}`} />
              </div>
              <h4 className="font-heading text-[1.1rem] text-ink mb-3 leading-tight">{pillar.title}</h4>
              <p className="text-sm text-body leading-[1.7]">{pillar.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
