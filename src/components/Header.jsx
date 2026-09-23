import useScrollY from '../hooks/useScrollY.js';
import useMobileMenu from '../hooks/useMobileMenu.js';
import useActiveSection from '../hooks/useActiveSection.js';
import { navLinks } from '../data/siteContent.js';

/**
 * Site header / nav. `homeHref` lets the calculator pages point links back to
 * "/#about" etc. instead of the in-page "#about" hash the homepage uses.
 */
export default function Header({ homeHref = '' }) {
  const scrollY = useScrollY();
  const { isOpen, toggle, close } = useMobileMenu();
  const sectionIds = navLinks.map((link) => link.href.replace('#', ''));
  const active = useActiveSection(sectionIds, homeHref ? null : 'hero');

  const scrolled = scrollY > 50;

  return (
    <>
      <header
        id="header"
        className={`fixed top-0 left-0 w-full z-[1000] bg-white/95 backdrop-blur-md transition-shadow duration-300 print:hidden ${
          scrolled ? 'shadow-[0_2px_20px_rgba(0,0,0,0.08)]' : ''
        }`}
      >
        <nav className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-20">
          <a href={homeHref || '#hero'} className="flex items-center gap-2.5 z-[1]">
            <img src={`${import.meta.env.BASE_URL}images/logo.svg`} alt="Ashva Finserv Logo" className="w-11 h-11 object-contain rounded-[10px]" />
            <div className="flex flex-col">
              <span className="font-heading font-bold text-[1.2rem] text-ink leading-tight">Ashva Finserv</span>
              <span className="text-[0.7rem] text-body-light tracking-wide lg:block hidden">Your Trust, Our Expertise</span>
            </div>
          </a>

          {/* Mobile off-canvas panel / desktop inline nav */}
          <ul
            className={`fixed lg:static top-0 right-0 lg:right-auto w-4/5 max-w-[320px] lg:max-w-none lg:w-auto h-screen lg:h-auto bg-white lg:bg-transparent flex-col lg:flex-row items-start lg:items-center flex gap-1 lg:gap-0.5 px-6 pb-6 pt-7 lg:p-0 shadow-[-10px_0_30px_rgba(0,0,0,0.1)] lg:shadow-none transition-transform duration-300 z-[1000] overflow-y-auto lg:overflow-visible ${
              isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
            }`}
          >
            <li className="flex items-center gap-2.5 w-full pb-[18px] mb-2 border-b border-border lg:hidden">
              <img src={`${import.meta.env.BASE_URL}images/logo.svg`} alt="Ashva Finserv Logo" className="w-11 h-11 object-contain rounded-[10px]" />
              <span className="font-heading font-bold text-[1.2rem] text-ink">Ashva Finserv</span>
            </li>

            {navLinks.map((link) => {
              const id = link.href.replace('#', '');
              const isActive = active === id;
              const href = homeHref ? `${homeHref}${link.href}` : link.href;
              return (
                <li key={link.href} className="w-full lg:w-auto">
                  <a
                    href={href}
                    onClick={close}
                    className={`flex items-center gap-3.5 lg:gap-0 w-full lg:w-auto rounded-[10px] lg:rounded-lg px-4 py-[11px] lg:px-3 lg:py-2 text-base lg:text-[0.85rem] font-medium whitespace-nowrap transition-all duration-300 ${
                      isActive ? 'text-primary bg-primary-lighter' : 'text-body hover:text-primary hover:bg-primary-lighter'
                    }`}
                  >
                    <i
                      className={`fas ${link.icon} lg:hidden inline-flex items-center justify-center w-8 h-8 min-w-[32px] rounded-lg text-[0.88rem] transition-all duration-300 ${
                        isActive ? 'bg-primary text-white' : 'bg-primary-lighter text-primary'
                      }`}
                    />
                    <span>{link.label}</span>
                  </a>
                </li>
              );
            })}

            <li className="lg:hidden block w-full mt-auto pt-5 border-t border-border">
              <a
                href="tel:+919327620268"
                className="flex items-center justify-center gap-2 w-full bg-primary text-white rounded-full py-3 font-semibold"
              >
                <i className="fas fa-phone" /> Call Now
              </a>
            </li>
          </ul>

          <a
            href={homeHref ? `${homeHref}#contact` : '#contact'}
            className="hidden lg:inline-flex items-center gap-2 bg-primary text-white rounded-full px-6 py-[10px] text-[0.85rem] font-semibold border-2 border-primary hover:bg-primary-dark hover:border-primary-dark transition-all duration-300"
          >
            Book Consultation
          </a>

          <button
            type="button"
            onClick={toggle}
            aria-label="Toggle navigation menu"
            className="flex lg:hidden flex-col gap-[5px] bg-transparent border-none cursor-pointer p-2 z-[1001]"
          >
            <span
              className={`w-6 h-[2.5px] bg-ink rounded-sm transition-all duration-300 ${
                isOpen ? 'translate-y-[7.5px] rotate-45' : ''
              }`}
            />
            <span className={`w-6 h-[2.5px] bg-ink rounded-sm transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
            <span
              className={`w-6 h-[2.5px] bg-ink rounded-sm transition-all duration-300 ${
                isOpen ? '-translate-y-[7.5px] -rotate-45' : ''
              }`}
            />
          </button>
        </nav>
      </header>

      {/* Dim backdrop behind the mobile panel */}
      <div
        onClick={close}
        aria-hidden="true"
        className={`fixed inset-0 bg-black/40 z-[999] transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      />
    </>
  );
}
