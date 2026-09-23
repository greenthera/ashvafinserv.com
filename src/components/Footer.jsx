import { CONTACT, footerQuickLinks, footerServiceLinks } from '../data/siteContent.js';

export default function Footer({ homeHref = '' }) {
  const year = new Date().getFullYear();
  const withHome = (href) => (homeHref ? `${homeHref}${href}` : href);

  return (
    <footer className="bg-ink text-white/70 pt-16">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 pb-14">
          <div>
            <a href={homeHref || '#hero'} className="flex items-center gap-2.5 mb-5">
              <img src={`${import.meta.env.BASE_URL}images/logo.svg`} alt="Ashva Finserv Logo" className="w-11 h-11 object-contain rounded-[10px]" />
              <div className="flex flex-col">
                <span className="font-heading font-bold text-[1.2rem] text-white">Ashva Finserv</span>
                <span className="text-[0.7rem] text-white/60 tracking-wide">Your Trust, Our Expertise</span>
              </div>
            </a>
            <p className="text-sm leading-7 mb-5 max-w-xs">
              Building financial confidence for every stage of life. Trusted financial advisory in Surat, Gujarat.
            </p>
            <div className="flex gap-3">
              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noopener"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <i className="fab fa-instagram" />
              </a>
              <a
                href={CONTACT.linkedin}
                target="_blank"
                rel="noopener"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <i className="fab fa-linkedin" />
              </a>
              <a
                href={CONTACT.emailHref}
                aria-label="Email"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <i className="fas fa-envelope" />
              </a>
              <a
                href={CONTACT.phoneHref}
                aria-label="Phone"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <i className="fas fa-phone" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-heading text-lg mb-5">Quick Links</h4>
            <ul className="flex flex-col gap-3 text-sm">
              {footerQuickLinks.map((link) => (
                <li key={link.href}>
                  <a href={withHome(link.href)} className="hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-heading text-lg mb-5">Our Services</h4>
            <ul className="flex flex-col gap-3 text-sm">
              {footerServiceLinks.map((label) => (
                <li key={label}>
                  <a href={withHome('#services')} className="hover:text-white transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-heading text-lg mb-5">Contact</h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li className="flex gap-2">
                <i className="fas fa-map-marker-alt mt-1" />
                <span>{CONTACT.addressOneLine}</span>
              </li>
              <li className="flex gap-2">
                <i className="fas fa-phone mt-1" />
                <a href={CONTACT.phoneHref} className="hover:text-white transition-colors">
                  {CONTACT.phone}
                </a>
              </li>
              <li className="flex gap-2">
                <i className="fas fa-envelope mt-1" />
                <a href={CONTACT.emailHref} className="hover:text-white transition-colors">
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex gap-2">
                <i className="fas fa-globe mt-1" />
                <a href={CONTACT.website} className="hover:text-white transition-colors">
                  www.ashvafinserv.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/50">
          <p>&copy; 2005-{year} Ashva Finserv. All Rights Reserved.</p>
          <p>
            Developed by{' '}
            <a href={CONTACT.shivantraHref} target="_blank" rel="noopener" className="text-white/70 hover:text-white">
              Shivantra
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
