import useReveal from '../../hooks/useReveal.js';
import SectionHeader from '../SectionHeader.jsx';
import { philosophyCards } from '../../data/siteContent.js';

export default function About() {
  const grid = useReveal();

  return (
    <section id="about" className="py-[72px] lg:py-[100px] bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeader tag="Who We Are" title="Building Financial Confidence for Every Stage of Life" />

        <div ref={grid.ref} className={`${grid.className} grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-start`}>
          <div>
            <p className="text-[1.15rem] font-medium text-ink mb-4 leading-[1.8]">
              Ashva Finserv is a family-focused financial advisory firm built on trust, discipline, and long-term
              relationships.
            </p>
            <p className="mb-4 text-body">
              We believe wealth is not only about growing money — it is about protecting families, securing futures,
              and creating lasting peace of mind.
            </p>
            <p className="mb-4 text-body">
              Our role is not to sell financial products, but to help our clients take confident, well-informed
              financial decisions at every important life stage.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {philosophyCards.map((card) => (
              <div
                key={card.title}
                className="p-7 bg-surface rounded-brand border-l-4 border-primary transition-all duration-300 hover:translate-x-2 hover:shadow-brand"
              >
                <div className="w-11 h-11 bg-primary-lighter text-primary rounded-[10px] flex items-center justify-center text-[1.1rem] mb-3">
                  <i className={`fas ${card.icon}`} />
                </div>
                <h4 className="mb-1.5 text-ink">{card.title}</h4>
                <p className="text-sm text-body-light">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
