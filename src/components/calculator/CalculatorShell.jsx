import Header from '../Header.jsx';
import Footer from '../Footer.jsx';
import BackToTop from '../BackToTop.jsx';
import WhatsAppFloat from '../WhatsAppFloat.jsx';
import ProfileBar from './ProfileBar.jsx';

export default function CalculatorShell({ eyebrow, title, intro, profile, formCard, results }) {
  return (
    <>
      <Header homeHref={import.meta.env.BASE_URL} />
      <main className="max-w-[1380px] mx-auto px-5 pt-[110px] sm:pt-[122px] pb-[30px] sm:pb-[60px]">
        <p className="text-primary text-xs font-extrabold tracking-[1.3px] uppercase mb-2">{eyebrow}</p>
        <h1 className="text-[29px] sm:text-[clamp(28px,3vw,40px)] -tracking-[1.3px] mb-2">{title}</h1>
        <p className="text-body-light mb-8">{intro}</p>

        {profile}

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(290px,0.76fr)_minmax(520px,1.5fr)] gap-[26px] items-start">
          {formCard}
          <section className="results min-w-0">{results}</section>
        </div>
      </main>
      <Footer homeHref={import.meta.env.BASE_URL} />
      <BackToTop />
      <WhatsAppFloat />
    </>
  );
}
