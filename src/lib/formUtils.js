/** Blocks e/E/+/- in number inputs, matching the original calculator's input guard. */
export function blockInvalidNumberKeys(event) {
  if (['e', 'E', '+', '-'].includes(event.key)) event.preventDefault();
}

/** Turns a client name into a filesystem-safe PDF filename prefix. */
export function slugifyFileName(name) {
  return String(name)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validates the "Your details" fields required before a PDF report can be downloaded. */
export function validateClientDetails({ clientName, clientPhone, clientEmail }) {
  const errors = {};

  if (!clientName.trim()) errors.clientName = 'Please enter your full name.';

  const digits = clientPhone.replace(/\D/g, '');
  if (!clientPhone.trim()) errors.clientPhone = 'Please enter your phone number.';
  else if (digits.length < 10) errors.clientPhone = 'Enter a valid phone number.';

  if (!clientEmail.trim()) errors.clientEmail = 'Please enter your email.';
  else if (!EMAIL_PATTERN.test(clientEmail.trim())) errors.clientEmail = 'Enter a valid email address.';

  return errors;
}
