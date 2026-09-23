export default function ProfileBar({ name, phone, email }) {
  if (!name && !phone && !email) return null;

  const initial = (name || phone || email || '?').trim().charAt(0).toUpperCase();

  return (
    <div
      className="flex items-center gap-4 text-white rounded-2xl px-[22px] py-4 mb-6 shadow-[0_12px_28px_rgba(16,42,67,0.2)]"
      style={{ background: 'linear-gradient(135deg, #1B6B2A, #0D4A1A)' }}
    >
      <div className="w-[46px] h-[46px] min-w-[46px] rounded-full bg-white/15 border border-white/35 flex items-center justify-center font-extrabold text-lg">
        {initial}
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <strong className="text-base -tracking-[0.2px]">{name || 'Welcome'}</strong>
        <div className="flex gap-4 flex-wrap text-[12.5px] text-white/75">
          {phone && (
            <span className="inline-flex items-center gap-1.5">
              <i className="fas fa-phone text-accent text-[11px]" /> {phone}
            </span>
          )}
          {email && (
            <span className="inline-flex items-center gap-1.5">
              <i className="fas fa-envelope text-accent text-[11px]" /> {email}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
