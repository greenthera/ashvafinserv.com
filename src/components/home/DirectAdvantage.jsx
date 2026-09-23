import useReveal from '../../hooks/useReveal.js';
import Button from '../Button.jsx';
import PromiseCard from '../PromiseCard.jsx';
import ServiceCard from '../ServiceCard.jsx';
import {
  daPromiseList,
  daWhyOffering,
  daWhyTrust,
  daSteps,
  daBenefits,
  daEligibility,
} from '../../data/siteContent.js';

function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const { ref, className: revealClass } = useReveal();
  return (
    <Tag ref={ref} className={`${revealClass} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

function HighlightGrid({ items }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8 text-left">
      {items.map((text, i) => (
        <div key={text} className="pl-4 border-l-2 border-white/30">
          <span className="block font-heading text-[1.6rem] font-bold text-white/40 leading-none mb-2">
            {String(i + 1).padStart(2, '0')}
          </span>
          <p className="text-white/90 text-[0.95rem] leading-[1.65]">{text}</p>
        </div>
      ))}
    </div>
  );
}

export default function DirectAdvantage() {
  return (
    <section id="home-loan" className="relative bg-surface overflow-hidden py-[72px] lg:py-[100px]">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 12% 15%, rgba(27,107,42,0.05) 0%, transparent 45%), radial-gradient(circle at 88% 10%, rgba(200,169,81,0.08) 0%, transparent 40%)',
        }}
      />

      <div className="relative max-w-[1200px] mx-auto px-6">
        <Reveal className="text-center max-w-[720px] mx-auto pt-10 pb-14">
          <span className="inline-block px-[18px] py-[6px] bg-primary-lighter text-primary text-[0.85rem] font-semibold rounded-full mb-4 tracking-wide uppercase">
            Ashva Direct Advantage&trade;
          </span>
          <p className="text-body-light text-[0.95rem] italic mb-2">Save More When You Come Directly.</p>
          <h2 className="mb-5">Come Direct. Save More.</h2>
          <div
            className="inline-flex items-center gap-2.5 border-[1.5px] border-accent rounded-full px-7 py-3 font-heading text-[1.1rem] font-semibold mb-5"
            style={{ background: '#F5EEDC', color: '#0D4A1A' }}
          >
            <i className="fas fa-tags text-accent" /> Up to 100% Waiver on Home Loan Processing Fees*
          </div>
          <p className="text-body-light text-[1.05rem] mb-4">
            No middlemen. No unnecessary costs. Just unbiased home loan advice.
          </p>
          <p className="font-heading italic text-[1.1rem] text-primary-dark mb-8">
            &quot;Because you came directly to us, we&apos;re happy to share the savings with you.&quot;
          </p>
          <Button href="#contact" size="lg" wrapOnMobile>
            Check Your Eligibility for Direct Advantage <i className="fas fa-arrow-right" />
          </Button>
        </Reveal>

        <Reveal className="max-w-[560px] mx-auto mb-14 text-left">
          <PromiseCard
            title="Ashva Customer First Promise"
            items={daPromiseList}
            note="Now the waiver becomes one benefit of a trusted advisory experience, rather than the main reason to choose you."
          />
        </Reveal>
      </div>

      <div className="relative bg-primary-dark py-16 text-center">
        <div className="max-w-[1200px] mx-auto px-6">
          <h3 className="text-white mb-7 text-[1.6rem] font-heading">Why Are We Offering This?</h3>
          <HighlightGrid items={daWhyOffering} />
        </div>
      </div>

      <div className="relative bg-primary-dark py-16 text-center border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-6">
          <h3 className="text-white mb-7 text-[1.6rem] font-heading">Why We Compete on Trust, Not Price</h3>
          <HighlightGrid items={daWhyTrust} />
        </div>
      </div>

      <div className="relative max-w-[1200px] mx-auto px-6">
        <Reveal as="h3" className="text-center text-ink text-[1.6rem] font-heading mb-2 mt-12">
          How It Works
        </Reveal>
        <Reveal
          className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14 mt-8 p-5 pt-8 rounded-brand-lg overflow-visible"
          style={{ background: 'linear-gradient(120deg, #E8F5E9 0%, #F5EEDC 100%)' }}
        >
          <div className="absolute top-0 left-[6%] right-[6%] h-[3px] rounded-full bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-da-shimmer" />
          {daSteps.map((step, i) => (
            <div
              key={step.badge}
              className="relative text-left bg-white/70 backdrop-blur-[10px] border border-white/70 rounded-brand px-[18px] pt-5 pb-4 shadow-[0_8px_20px_rgba(27,107,42,0.1)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_32px_rgba(27,107,42,0.18)]"
            >
              <div
                className="absolute -top-4 left-4 w-[38px] h-[38px] rounded-full text-white font-heading font-bold text-[0.95rem] flex items-center justify-center shadow-[0_4px_12px_rgba(27,107,42,0.35)]"
                style={
                  i % 2 === 1
                    ? { background: 'linear-gradient(145deg, #C8A951, #a5822f)', boxShadow: '0 4px 12px rgba(200,169,81,0.4)' }
                    : { background: 'linear-gradient(145deg, #1B6B2A, #0D4A1A)' }
                }
              >
                {step.badge}
              </div>
              <h4 className="mt-3 mb-1.5 text-base leading-snug">{step.title}</h4>
              {step.subtitle && <p className="text-[0.88rem] text-body-light">{step.subtitle}</p>}
              {step.list && (
                <ul className="flex flex-wrap gap-1.5 mt-2">
                  {step.list.map((item) => (
                    <li key={item} className="bg-primary-lighter text-primary text-[0.72rem] font-semibold px-3 py-1 rounded-full">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Reveal>

        <Reveal as="h3" className="text-center text-ink text-[1.6rem] font-heading mb-2">
          Why Customers Love It
        </Reveal>
        <Reveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 mb-14 mt-8">
          {daBenefits.map((benefit) => (
            <ServiceCard key={benefit.title} {...benefit} />
          ))}
        </Reveal>

        <Reveal as="h3" className="text-center text-ink text-[1.6rem] font-heading mb-2">
          Who Can Apply?
        </Reveal>
        <Reveal className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-5 mb-14 mt-8">
          {daEligibility.map((item) => (
            <div key={item.title} className="group relative text-center px-1 pt-2 pb-3.5 transition-transform duration-300 hover:-translate-y-1">
              <div
                className="w-14 h-14 mx-auto mb-3.5 text-primary rounded-2xl flex items-center justify-center text-[1.3rem] transition-all duration-300 group-hover:text-white group-hover:-rotate-6"
                style={{ background: 'linear-gradient(145deg, #E8F5E9, rgba(200,169,81,0.15))' }}
              >
                <i className={`fas ${item.icon}`} />
              </div>
              <h4 className="text-[0.85rem] font-semibold text-ink">{item.title}</h4>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-3/5" />
            </div>
          ))}
        </Reveal>

        <Reveal as="h3" className="text-center text-ink text-[1.6rem] font-heading mb-2">
          Important Note
        </Reveal>
        <Reveal
          className="max-w-[760px] mx-auto mb-14 mt-8 bg-accent-light border-l-4 border-accent rounded-brand px-8 py-7 text-center"
        >
          <p className="text-[0.85rem] text-body-light leading-[1.7]">
            The waiver applies only to processing charges where applicable, and is subject to the nature of the case,
            our prevailing policy and at the sole discretion of Ashva Finserv.
          </p>
        </Reveal>

        <Reveal
          className="text-center max-w-[720px] mx-auto rounded-brand-lg px-10 py-12 shadow-brand-xl"
          style={{ background: 'linear-gradient(145deg, #1B6B2A, #0D4A1A)' }}
        >
          <h3 className="text-white mb-4">Why pay extra because a middleman was involved?</h3>
          <p className="text-white/85 leading-[1.9] mb-7">
            Come directly to Ashva Finserv.
            <br />
            Receive expert guidance.
            <br />
            Receive transparent advice.
            <br />
            And where eligible,
            <br />
            Save up to 100% on Ashva&apos;s processing/advisory charges.
          </p>
          <Button href="#contact" variant="white" size="lg" wrapOnMobile>
            Book Your Free Mortgage Health Check
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
