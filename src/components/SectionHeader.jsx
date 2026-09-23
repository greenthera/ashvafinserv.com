import useReveal from '../hooks/useReveal.js';

export default function SectionHeader({ tag, title, subtitle, className = '' }) {
  const { ref, className: revealClass } = useReveal();

  return (
    <div ref={ref} className={`${revealClass} text-center max-w-[680px] mx-auto mb-[60px] ${className}`}>
      <span className="inline-block px-[18px] py-[6px] bg-primary-lighter text-primary text-[0.85rem] font-semibold rounded-full mb-4 tracking-wide uppercase">
        {tag}
      </span>
      <h2>{title}</h2>
      {subtitle && <p className="text-body-light text-[1.05rem] mt-3">{subtitle}</p>}
    </div>
  );
}
