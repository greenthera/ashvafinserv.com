const inputClasses =
  'w-full [appearance:textfield] border rounded-lg px-3 py-[11px] font-inherit text-[15px] text-ink outline-none bg-white transition-all focus:shadow-[0_0_0_3px_rgba(27,107,42,0.15)]';

export default function Field({ label, unit, id, readOnly = false, required = false, error, hint, ...inputProps }) {
  return (
    <div className="mb-[15px]">
      <label htmlFor={id} className="flex gap-1 text-[13px] font-bold mb-[7px]">
        {label} {required && <span className="text-red-500">*</span>} {unit && <span className="text-primary">{unit}</span>}
      </label>
      <input
        id={id}
        readOnly={readOnly}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputClasses} ${readOnly ? 'text-[#52677b] bg-[#f2f6fa] border-dashed' : ''} ${
          error ? 'border-red-400 focus:border-red-500' : 'border-[#cbd8e4] focus:border-primary'
        }`}
        {...inputProps}
      />
      {error ? (
        <p id={`${id}-error`} className="text-red-500 text-xs mt-1.5">
          {error}
        </p>
      ) : (
        hint && <p className="text-body-light text-xs mt-1.5">{hint}</p>
      )}
    </div>
  );
}
