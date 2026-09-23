export default function ServiceCard({ icon, title, text }) {
  return (
    <div className="group relative overflow-hidden bg-white border border-border rounded-brand px-7 py-9 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-brand-lg hover:border-transparent">
      <div
        className="w-14 h-14 text-primary rounded-[14px] flex items-center justify-center text-[1.3rem] mb-5"
        style={{ background: 'linear-gradient(135deg, #E8F5E9, rgba(200,169,81,0.1))' }}
      >
        <i className={`fas ${icon}`} />
      </div>
      <h3 className="mb-2.5 text-[1.15rem]">{title}</h3>
      <p className="text-sm text-body-light leading-[1.7]">{text}</p>
      <span className="absolute bottom-0 left-0 w-full h-[3px] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 bg-gradient-to-r from-primary to-accent" />
    </div>
  );
}
