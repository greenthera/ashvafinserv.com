const base =
  'inline-flex items-center gap-2 px-7 py-3 font-body text-[0.95rem] font-semibold border-2 border-transparent rounded-full cursor-pointer transition-all duration-300';

const variants = {
  primary:
    'bg-primary text-white border-primary hover:bg-primary-dark hover:border-primary-dark hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(27,107,42,0.3)]',
  outline: 'bg-transparent text-primary border-primary hover:bg-primary hover:text-white hover:-translate-y-0.5',
  white: 'bg-white text-primary border-white hover:bg-transparent hover:text-white hover:-translate-y-0.5',
  'outline-white':
    'bg-transparent text-white border-white hover:bg-white hover:text-primary hover:-translate-y-0.5',
};

/**
 * Renders as <a> when `href` is given, otherwise a <button>.
 * variant: 'primary' | 'outline' | 'white' | 'outline-white'
 * size: 'md' | 'lg'
 * block: full width, centered content (matches the original .btn-block)
 * wrapOnMobile: lets long single-line CTA text wrap and go full-width below
 *   the `md` breakpoint instead of overflowing (matches the original
 *   .da-hero .btn / .da-closing-cta .btn responsive overrides)
 */
export default function Button({
  href,
  variant = 'primary',
  size = 'md',
  block = false,
  wrapOnMobile = false,
  className = '',
  children,
  ...rest
}) {
  const sizeClass = size === 'lg' ? 'px-9 py-4 text-base' : '';
  const blockClass = block ? 'w-full justify-center' : '';
  const wrapClass = wrapOnMobile
    ? 'whitespace-normal text-center justify-center w-full max-w-[380px] md:w-auto md:max-w-none md:whitespace-nowrap max-[480px]:max-w-none max-[480px]:px-6 max-[480px]:py-[14px] max-[480px]:text-[0.9rem]'
    : 'whitespace-nowrap';
  const classes = `${base} ${variants[variant]} ${sizeClass} ${blockClass} ${wrapClass} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
