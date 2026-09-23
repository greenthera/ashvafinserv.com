import useReveal from '../../hooks/useReveal.js';
import { CONTACT } from '../../data/siteContent.js';

const credentials = ['CFP - IN160186', 'PGDM - Finance', 'B.E. Civil'];

export default function Founder() {
  const content = useReveal();

  return (
    <section id="founder" className="py-[72px] lg:py-[100px] bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div
          ref={content.ref}
          className={`${content.className} grid grid-cols-1 lg:grid-cols-[0.4fr_1fr] gap-[60px] items-center max-w-[900px] mx-auto text-center lg:text-left`}
        >
          <div className="text-center">
            <div className="w-[180px] h-[180px] mx-auto mb-5 rounded-full overflow-hidden shadow-brand-lg">
              <img
                src={`${import.meta.env.BASE_URL}images/founder.jpeg`}
                alt="Deep Shah — Founder & CEO, Ashva Finserv"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {credentials.map((cred) => (
                <span key={cred} className="px-3.5 py-1 bg-primary-lighter text-primary text-xs font-semibold rounded-full">
                  {cred}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="inline-block px-[18px] py-[6px] bg-primary-lighter text-primary text-[0.85rem] font-semibold rounded-full mb-3 tracking-wide uppercase">
              Founder&apos;s Note
            </span>
            <h2 className="text-[2rem] mb-1">Deep Shah</h2>
            <p className="text-primary font-medium mb-6">Founder &amp; CEO, Ashva Finserv</p>
            <blockquote className="font-heading text-[1.15rem] italic text-ink-light leading-[1.8] pl-6 border-l-[3px] border-accent mb-7">
              &quot;My mission is to help families take confident financial decisions and experience peace with their
              money. I don&apos;t measure success by returns alone, but by the trust families place in me over
              generations.&quot;
            </blockquote>
            <div className="flex flex-wrap gap-5 justify-center lg:justify-start">
              <a href={CONTACT.phoneHref} className="flex items-center gap-2 text-[0.9rem] text-body font-medium hover:text-primary transition-colors">
                <i className="fas fa-phone text-primary" /> {CONTACT.phone}
              </a>
              <a href={CONTACT.emailHref} className="flex items-center gap-2 text-[0.9rem] text-body font-medium hover:text-primary transition-colors">
                <i className="fas fa-envelope text-primary" /> {CONTACT.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
