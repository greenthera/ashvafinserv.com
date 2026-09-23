import { useState } from 'react';
import useReveal from '../../hooks/useReveal.js';
import SectionHeader from '../SectionHeader.jsx';
import Button from '../Button.jsx';
import { CONTACT, serviceOptions } from '../../data/siteContent.js';

const inputClasses =
  'px-4 py-3 font-body text-[0.95rem] border-[1.5px] border-border rounded-brand bg-white text-ink outline-none transition-all duration-300 focus:border-primary focus:shadow-[0_0_0_3px_rgba(27,107,42,0.1)]';

export default function Contact() {
  const grid = useReveal();
  const [name, setName] = useState('');
  const [service, setService] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const serviceText = service.trim() || 'Not specified';
    const messageText = message.trim() || 'No additional message';
    const text = `Hi Ashva Finserv! I would like to enquire about your services.\n\n*Name:* ${trimmedName}\n*Service Interested In:* ${serviceText}\n*Message:* ${messageText}`;

    window.location.href = `https://wa.me/919327620268?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="contact" className="py-[72px] lg:py-[100px] bg-surface">
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeader
          tag="Get In Touch"
          title="Book a Personal Financial Clarity Session"
          subtitle="Let us walk with you in your financial journey. Reach out today for a no-obligation consultation."
        />

        <div ref={grid.ref} className={`${grid.className} grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start`}>
          <div className="bg-white p-10 rounded-brand-lg shadow-brand">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-[0.85rem] font-semibold text-ink">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClasses}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="service" className="text-[0.85rem] font-semibold text-ink">
                  Service Interested In
                </label>
                <select
                  id="service"
                  name="service"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className={`${inputClasses} cursor-pointer appearance-none pr-10`}
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%234A4A5A' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 16px center',
                  }}
                >
                  <option value="">Select a service</option>
                  {serviceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-[0.85rem] font-semibold text-ink">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Tell us about your financial goals or questions..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`${inputClasses} resize-y min-h-[100px]`}
                />
              </div>

              <Button type="submit" size="lg" block>
                <span>Send via WhatsApp</span> <i className="fab fa-whatsapp" />
              </Button>
            </form>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white p-9 rounded-brand-lg shadow-brand">
              <h3 className="mb-6 text-[1.2rem]">Contact Information</h3>

              <div className="flex gap-4 mb-5">
                <div className="w-11 h-11 min-w-[44px] bg-primary-lighter text-primary rounded-[10px] flex items-center justify-center text-base">
                  <i className="fas fa-map-marker-alt" />
                </div>
                <div>
                  <h4 className="text-[0.9rem] mb-0.5">Visit Us</h4>
                  <p className="text-[0.85rem] text-body-light leading-[1.6]">
                    {CONTACT.address.map((line, i) => (
                      <span key={line}>
                        {line}
                        {i < CONTACT.address.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 mb-5">
                <div className="w-11 h-11 min-w-[44px] bg-primary-lighter text-primary rounded-[10px] flex items-center justify-center text-base">
                  <i className="fas fa-phone" />
                </div>
                <div>
                  <h4 className="text-[0.9rem] mb-0.5">Call Us</h4>
                  <p className="text-[0.85rem]">
                    <a href={CONTACT.phoneHref} className="text-body-light hover:text-primary transition-colors">
                      {CONTACT.phone}
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-11 h-11 min-w-[44px] bg-primary-lighter text-primary rounded-[10px] flex items-center justify-center text-base">
                  <i className="fas fa-envelope" />
                </div>
                <div>
                  <h4 className="text-[0.9rem] mb-0.5">Email Us</h4>
                  <p className="text-[0.85rem]">
                    <a href={CONTACT.emailHref} className="text-body-light hover:text-primary transition-colors">
                      {CONTACT.email}
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-brand-lg overflow-hidden shadow-brand w-full h-[250px]">
              <iframe
                title="Ashva Finserv location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3594.5551283939317!2d72.81764821066474!3d21.171894280432305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04fcaf10bb8cf%3A0xe7822c6cfaa58562!2sAshva%20finserv!5e1!3m2!1sen!2sin!4v1775485476409!5m2!1sen!2sin"
                className="block w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
