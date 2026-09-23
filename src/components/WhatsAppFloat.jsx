import useScrollY from '../hooks/useScrollY.js';
import { CONTACT } from '../data/siteContent.js';

export default function WhatsAppFloat() {
  const scrollY = useScrollY();
  const visible = scrollY > 600;

  return (
    <a
      href={CONTACT.whatsappHref}
      target="_blank"
      rel="noopener"
      aria-label="Chat on WhatsApp"
      className={`fixed bottom-8 right-24 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center text-[1.6rem] shadow-[0_4px_20px_rgba(37,211,102,0.4)] z-[900] transition-all duration-300 animate-whatsapp-pulse hover:scale-110 hover:shadow-[0_6px_25px_rgba(37,211,102,0.5)] print:hidden ${
        visible ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-3'
      }`}
    >
      <i className="fab fa-whatsapp" />
    </a>
  );
}
