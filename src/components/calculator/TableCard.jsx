export default function TableCard({
  title,
  subtitleLabel,
  subtitleValue,
  subtitleText,
  badge,
  columns,
  rows,
  emptyMessage,
  className = '',
}) {
  return (
    <div className={`bg-white border border-border rounded-[15px] shadow-[0_8px_30px_rgba(26,56,86,0.06)] overflow-hidden ${className}`}>
      <div className="flex justify-between items-start sm:items-end gap-2.5 px-[17px] sm:px-[22px] pt-[17px] sm:pt-[22px] pb-3.5 sm:pb-4">
        <div>
          <h2 className="text-lg">{title}</h2>
          {subtitleLabel && (
            <p className="text-body-light text-[13px] mt-1">
              {subtitleLabel}: <strong className="text-ink">{subtitleValue}</strong>
            </p>
          )}
          {subtitleText && <p className="text-body-light text-[13px] mt-1">{subtitleText}</p>}
        </div>
        {badge && (
          <span className="bg-primary-lighter text-primary rounded-full px-2.5 py-1.5 text-[11px] font-extrabold">
            {badge}
          </span>
        )}
      </div>

      <div className="overflow-auto max-h-[590px]">
        <table className="w-full border-collapse min-w-[590px]">
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th
                  key={col}
                  className={`sticky top-0 z-[1] bg-[#eef4f9] text-[#52677b] text-[11px] uppercase tracking-wide px-[15px] py-3 ${
                    i === 0 ? 'text-left' : 'text-right'
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((row, rowIndex) => (
                // eslint-disable-next-line react/no-array-index-key
                <tr key={rowIndex} className="hover:bg-[#f7fbff]">
                  {row.map((cell, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <td
                      key={i}
                      className={`px-[15px] py-[13px] border-t border-[#edf1f5] text-[13px] [font-variant-numeric:tabular-nums] ${
                        i === 0 ? 'text-left font-bold text-[#4c6376]' : 'text-right'
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-[15px] py-[35px] text-center text-body-light">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
