export default function ChartCard({ title, subtitle, canvasRef, ariaLabel, className = '' }) {
  return (
    <div className={`bg-white border border-border rounded-[15px] shadow-[0_8px_30px_rgba(26,56,86,0.06)] pb-[18px] ${className}`}>
      <div className="flex justify-between items-end px-[22px] pt-[22px] pb-4">
        <div>
          <h2 className="text-lg">{title}</h2>
          <p className="text-body-light text-[13px] mt-1">{subtitle}</p>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        aria-label={ariaLabel}
        className="block w-[calc(100%-24px)] sm:w-[calc(100%-36px)] h-[185px] sm:h-[210px] mx-3 sm:mx-[18px] rounded-lg"
        style={{ background: 'linear-gradient(180deg, #f8fbfe, #fff)' }}
      />
    </div>
  );
}
