import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import BackToTop from '../components/BackToTop.jsx';
import WhatsAppFloat from '../components/WhatsAppFloat.jsx';
import Hero from '../components/home/Hero.jsx';
import About from '../components/home/About.jsx';
import Services from '../components/home/Services.jsx';
import DirectAdvantage from '../components/home/DirectAdvantage.jsx';
import Calculators from '../components/home/Calculators.jsx';
import WhyUs from '../components/home/WhyUs.jsx';
import MissionVision from '../components/home/MissionVision.jsx';
import Clients from '../components/home/Clients.jsx';
import Founder from '../components/home/Founder.jsx';
import Contact from '../components/home/Contact.jsx';
import CtaBanner from '../components/home/CtaBanner.jsx';

const SEO = {
  title: 'Ashva Finserv — Smart Planning, Secure Future',
  description:
    'Ashva Finserv — Guiding families to financial confidence, clarity & peace of mind. Trusted financial advisory in Surat.',
};

export default function Home() {
  const { hash } = useLocation();

  useEffect(() => {
    document.title = SEO.title;
  }, []);

  // Nav links from other pages (e.g. "/#calculators") land here as a fresh
  // page load; the browser can't scroll to the target since it doesn't exist
  // in the DOM yet at navigation time, so it's done manually once mounted.
  useEffect(() => {
    if (!hash) return;
    document.querySelector(hash)?.scrollIntoView();
  }, [hash]);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <DirectAdvantage />
        <Calculators />
        <WhyUs />
        <MissionVision />
        <Clients />
        <Founder />
        <Contact />
        <CtaBanner />
      </main>
      <Footer />
      <BackToTop />
      <WhatsAppFloat />
    </>
  );
}
