export default function PromiseCard({ title, items, note, className = '' }) {
  return (
    <div
      className={`text-white p-9 sm:p-10 rounded-brand-lg shadow-brand-xl ${className}`}
      style={{ background: 'linear-gradient(145deg, #1B6B2A, #0D4A1A)' }}
    >
      <h3 className="text-white text-[1.4rem] mb-6">{title}</h3>
      <ul className="flex flex-col gap-4">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-[0.95rem] leading-normal">
            <i className="fas fa-check-circle text-accent mt-[3px]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      {note && (
        <p className="mt-6 pt-5 border-t border-white/15 text-white/75 text-[0.85rem] italic">{note}</p>
      )}
    </div>
  );
}
