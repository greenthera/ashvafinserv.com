const variantClasses = {
  default: 'bg-[#f7fafc]',
  primary: 'bg-primary-lighter',
  success: 'bg-accent-light',
};

const valueClasses = {
  default: '',
  primary: 'text-primary',
  success: 'text-[#8a6d2f]',
};

export default function SummaryGrid({ metrics, columns = 3 }) {
  return (
    <div
      className={`card p-5 grid gap-3 mb-[18px] bg-white border border-border rounded-[15px] shadow-[0_8px_30px_rgba(26,56,86,0.06)] ${
        columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'
      }`}
    >
      {metrics.map((metric) => (
        <div key={metric.label} className={`p-[13px] rounded-[9px] ${variantClasses[metric.variant || 'default']}`}>
          <p className="text-body-light text-[11px] font-bold uppercase tracking-wide mb-1.5">{metric.label}</p>
          <strong className={`text-lg -tracking-[0.5px] ${valueClasses[metric.variant || 'default']}`}>
            {metric.value}
          </strong>
        </div>
      ))}
    </div>
  );
}
